import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Job } from "@/models/job";
import { Student } from "@/models/student";
import { Application } from "@/models/application";

export async function GET() {
  try {

    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const totalJobs = await Job.countDocuments();

    const savedJobsCount = student.savedJobs.length;

    const applicationsCount = await Application.countDocuments({
      student: student._id
    });

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title company location");

    return NextResponse.json({
      totalJobs,
      savedJobsCount,
      applicationsCount,
      recentJobs
    });

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}