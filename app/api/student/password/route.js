import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function PUT(req){
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const {currentPassword, newPassword, confirmPassword} = await req.json();

        if(!currentPassword || !newPassword || !confirmPassword){
            return NextResponse.json({message:"All fields Are required"}, {status: 400})
        }
        if(newPassword !== confirmPassword){
            return NextResponse.json({message:"passwords didn't match"}, {status: 405})
        }
        if(!token){
            return NextResponse.json({message: "Unauthorised"}, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return NextResponse.json({message: "No User found"}, {status: 404})
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return NextResponse.json({message: "Invalid Credentials"}, {status: 403})
        }

        const hashPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashPassword;
        await user.save();

        cookieStore.delete("token");

        return NextResponse.json({message: "Password Updated"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Server error ${error.message}`}, {status: 500})
    }
}