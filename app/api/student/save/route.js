import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Job } from "@/models/job";
import { Student } from "@/models/student";

export async function PATCH(req){
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({message:"Unauthorized"}, {status: 401})
        };

        const { id } = await req.json();

        const job = await Job.findById(id);

        if(!job){
            return NextResponse.json({message:"Job Not Found"}, {status: 404})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const student = await Student.findOne({user: decoded.id});

        if(!student){
            return NextResponse.json({message:"Student Not Found"}, {status: 404})
        };

        await Student.findByIdAndUpdate(student._id, {
         $addToSet: { savedJobs: job._id }
        });

        return NextResponse.json({message:"Job Saved"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message:`Server Error ${error.message}`}, {status: 500})
    }
}