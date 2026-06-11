import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import { Recruiter } from "@/models/recruiter";

export async function GET() {
  try {
    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    if(!decoded) {
      return NextResponse.json({ message: "Invalid token" },{ status: 401 });
    }

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" },{ status: 403 });
    }

    const recruiter = await Recruiter.findOne({user: decoded.id})

    if(!recruiter){
      return NextResponse.json({message: "No Recruiter Found Please Try again"}, {status: 404})
    }

    const jobs = await Job.find({
      recruiter: recruiter._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ jobs },{ status: 200 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Server error ${error.message}` },{ status: 500 });
  }
}
