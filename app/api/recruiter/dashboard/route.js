import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { Recruiter } from "@/models/recruiter";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import { Student } from "@/models/student";

export async function GET() {
  try {

    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recruiter = await Recruiter.findOne({ user: decoded.id });

    if (!recruiter) {
      return NextResponse.json({ message: "Recruiter not found" }, { status: 404 });
    }

    const jobs = await Job.find({ recruiter: recruiter._id });

    const jobIds = jobs.map(job => job._id);

    const activeJobs = jobs.length;

    const totalApplicants = await Application.countDocuments({
      job: { $in: jobIds }
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted"
    });

    const recentApplications = await Application.find({
      job: { $in: jobIds }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("job", "title")
      .populate({
         path: "student",
         populate: {
           path: "user",
           select:"name email"
         }
      })

    return NextResponse.json({
      activeJobs,
      totalApplicants,
      shortlisted,
      recentApplications
    });

  } catch (error) {
    return NextResponse.json(
      { message: `Server Error ${error.message}` },
      { status: 500 }
    );
  }
}