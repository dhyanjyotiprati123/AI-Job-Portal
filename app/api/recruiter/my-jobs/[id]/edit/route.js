
import { NextResponse } from "next/server";
import { Job } from "@/models/job";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";

export async function PATCH(req, {params}){
    try {
        await connectDB();

        const body = await req.json();
        const {id} = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({message:"Unauthorized"}, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "recruiter"){
            return NextResponse.json({message:"Access Denied"}, {status: 403})
        }

        const job = await Job.findById(id);

        if(!job){
            return NextResponse.json({message:"No Job Found"}, {status: 404})
        }

         const allowedFields = [
            "title",
            "company",
            "companyEmail",
            "location",
            "salary",
            "description",
            "jobType",
            "skillsRequired",
            "experienceLevel",
       ];

    const updates = {};

    for (let key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(id,{ $set: updates },{ new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ message: "Job not found" },{ status: 404 });
    }

    if (!updatedJob.isActive) {
       return NextResponse.json({ message: "Cannot edit a closed job" },{ status: 400 });
    }

    await updatedJob.save();

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJob },
      { status: 200 }
    );
    } catch (error) {
        return NextResponse.json({message: `Server Error : ${error.message}`}, {status: 500})
    }
}