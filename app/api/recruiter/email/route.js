
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req){
    try {
        await connectDB();

        const { newEmail, emailPassword } = await req.json();

        if(!newEmail || !emailPassword){
            return NextResponse.json({message: "All Fields Are Required"}, {status: 401})
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({message: "Unauthorized"}, {status: 403})
        };

        const decode = jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decode.id);

        if(!user){
            return NextResponse.json({message:"No user found"}, {status: 404})
        }

        const isMatch = await bcrypt.compare(emailPassword, user.password);

        if(!isMatch){
            return NextResponse.json({message: "Invalid Credentials"}, {status: 405})
        }

        user.email = newEmail;
        await user.save();

        return NextResponse.json({message: "Email Updated Successfully"}, {status: 200});
    } catch (error) {
         return NextResponse.json({message: `Server Error ${error.message}`}, {status: 500})
    }
}