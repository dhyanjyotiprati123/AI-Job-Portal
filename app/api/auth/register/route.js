import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { Recruiter } from "@/models/recruiter";
import { Student } from "@/models/student";

export async function POST(req){
     try {
        await connectDB();

        const {email, password, name, role} =await req.json();

        if(!email || !password || !name || !role ){
            return NextResponse.json({message:"All Fields are required"}, {status: 403})
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return NextResponse.json({message:"User Already Exist"}, {status: 401})
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({email, password:hashPassword, name, role});

        if(role === "recruiter"){
            await Recruiter.create({
                user: user._id
            })
        }
        
        if(role === "student"){
            await Student.create({
                user: user._id
            })
        }

        return NextResponse.json(
            {
                message:"User Registered Successfully"
            },
            {status: 201})
     } catch (error) {
        return NextResponse.json({message:`Server Error ${error.message}`}, {status: 500})
     }
}