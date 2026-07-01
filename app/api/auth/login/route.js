
import { NextResponse } from "next/server";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req){
    try {
        await connectDB();

        const {email, password} = await req.json();

        if(!email || !password){
            return NextResponse.json({message:"All Fields Are Required"}, {status: 400})
        }

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({message: "User Not Fount"}, {status: 404})
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return NextResponse.json({message:"Invalid Credentials"}, {status: 403})
        }

        const token = await jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 60 * 60 * 24 * 7,
         path: "/",
        });

        return NextResponse.json(
            {
                message: "Login Successfull",
                user:{
                    id:user._id,
                    role:user.role,
                    name:user.role,
                    email:user.email
                }
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return NextResponse.json({message:`Server Error ${error.message}`}, {status: 500})
    }
}
