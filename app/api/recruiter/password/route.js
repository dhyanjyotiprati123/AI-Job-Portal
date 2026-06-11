
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req){
    try {
        await connectDB();

        const {currentPassword, newPassword} = await req.json();

        if(!currentPassword || !newPassword){
            return NextResponse.json({message: "All Fields Are Required"}, {status: 405})
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({message: "Access Denied"}, {status: 403})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return NextResponse.json({message: "No User Found"}, {status: 404})
        };

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return NextResponse.json({message: "Invalid Credentials"}, {status: 401})
        }

        const hashPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashPassword;
        await user.save();

        cookieStore.delete("token");

        return NextResponse.json({message:"Password Updated Successfully"}, {status: 200});

    } catch (error) {
        return NextResponse.json({message: `Server Error ${error.message}`}, {status: 500})
    }
}