import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/application";
import { Job } from "@/models/job";
import { Student } from "@/models/student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { Recruiter } from "@/models/recruiter";
import { Notification } from "@/models/notification";

export async function POST(req) {
  try {
    await connectDB();

    const { jobId, coverLetter } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
       return NextResponse.json({ message: "Invalid Job ID" },{ status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Only students can apply" },{ status: 403 });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ message: "Job not found" },{ status: 404 });
    }

    if (!job.isActive) {
      return NextResponse.json({ message: "Job is closed" },{ status: 400 });
    }

    const student = await Student.findOne({ user: decoded.id }).populate("user","name email");

    if (!student) {
      return NextResponse.json({ message: "Student profile not found" },{ status: 404 });
    }

    if (!student.resume) {
      return NextResponse.json({ message: "Please upload resume in profile before applying" },{ status: 400 });
    }

    const existingApplication = await Application.findOne({student: student._id,job: jobId,});

    if (existingApplication) {
      return NextResponse.json({ message: "You already applied to this job" },{ status: 400 });
    }

    const recruiter = await Recruiter.findById(job.recruiter);

    if(!recruiter){
      return NextResponse.json({message:"recruiter for this job is not found"}, {status: 404})
    }
    

    const application = await Application.create({
      student: student._id,
      job: jobId,
      recruiter: recruiter._id,
      resume: student.resume,
      coverLetter,
    });
 
    job.applicants.push(application._id);
    await job.save();

    const existingNotification = await Notification.findOne({
          user: recruiter.user,
          application: application._id,
          title: "New Job Application",
    });

    if(!existingNotification){
       await Notification.create({
         user: recruiter.user,
         application: application._id,
         title: "New Job Application",
         message: `${student.user?.name || "A candidate"} applied for ${job.title}`,
      });
    }
    return NextResponse.json({ message: "Application submitted successfully" },{ status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}