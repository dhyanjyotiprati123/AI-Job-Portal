
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Job } from "@/models/job";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { Application } from "@/models/application";
import { Recruiter } from "@/models/recruiter";
import { Student } from "@/models/student";
import { Notification } from "@/models/notification";

export async function DELETE(req, { params }) {
  try {
   await connectDB();

    const {id} = await params;
    const cookieStore = await cookies()

    const token =cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const job = await Job.findById(id).populate("recruiter");

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if(job.recruiter.user.toString() !== decoded.id){
      return NextResponse.json({message:"Access Denied"},{status: 403})
    }

    const applications = await Application.find({ job: id },"_id");

    const applicationIds = applications.map(app => app._id);

    await Notification.deleteMany({application: {$in: applicationIds,},});

    await Application.deleteMany({ job: id });
    await Student.updateMany(
       { savedJobs: id },
       { $pull: { savedJobs: id } }
    );

    await Job.findByIdAndDelete(id);

    return NextResponse.json({ message: "Job deleted successfully" },{ status: 200 });

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}