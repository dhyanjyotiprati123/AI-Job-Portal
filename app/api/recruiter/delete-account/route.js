import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Job } from "@/models/job";
import { Recruiter } from "@/models/recruiter";
import { User } from "@/models/user";
import { Student } from "@/models/student";
import { Application } from "@/models/application";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification";

export async function DELETE(req) {
  try {

    await connectDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Forbidden" },{ status: 403 });
    }

    const userId = decoded.id;

    const recruiter = await Recruiter.findOne({
      user: userId,
    });

    if (!recruiter) {
      return NextResponse.json({ message: "Recruiter not found" },{ status: 404 });
    }

    const jobs = await Job.find({
      recruiter: recruiter._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } },"_id");

    const applicationIds = applications.map((app) => app._id);

    await Notification.deleteMany({application: { $in: applicationIds,},});

    await Application.deleteMany({
      job: { $in: jobIds },
    });

    await Student.updateMany(
      {},
      {
        $pull: {
          savedJobs: { $in: jobIds },
        },
      }
    );

    await Job.deleteMany({
      recruiter: recruiter._id,
    });

    await Recruiter.findByIdAndDelete(
      recruiter._id
    );

    await User.findByIdAndDelete(userId);

    cookieStore.delete("token");

    return NextResponse.json({ message: "Account deleted successfully",},{ status: 200 });

  } catch (error) {

    return NextResponse.json({message: `Server Error ${error.message}`,},{ status: 500 });
  }
}