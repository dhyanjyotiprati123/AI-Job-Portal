
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import { Recruiter } from "@/models/recruiter";

export async function POST(req) {
  try {
    await connectDB()

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
      return NextResponse.json({ message: "Invalid token" },{ status: 401 });
    }

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" },{ status: 403 });
    }

    const body = await req.json();
    
    const recruiter = await Recruiter.findOne({user: decoded.id});

    if(!recruiter){
      return NextResponse.json({message: "Recruiter Not Found"}, {status: 404})
    }

    const job = await Job.create({
      ...body,
      recruiter: recruiter._id, 
    });

    return NextResponse.json({ message: "Job created successfully", job },{ status: 201 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Server error ${error.message}` },{ status: 500 });
  }
}
