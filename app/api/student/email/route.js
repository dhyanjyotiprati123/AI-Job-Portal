import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs"

export async function PUT(req){
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const {password, email} = await req.json();

        if(!password || !email){
            return NextResponse.json({message:"All fields are required"}, {status: 402})
        }

        if(!token){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return NextResponse.json({message:"No User Found"}, {status: 404})
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return NextResponse.json({message: "Invalid Credentials"}, {status: 403})
        }

        user.email = email;
        await user.save();

        cookieStore.delete("token");

        return NextResponse.json({message: "Email Updated Successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Server Error ${error.message}`}, {status: 500})
    }
}