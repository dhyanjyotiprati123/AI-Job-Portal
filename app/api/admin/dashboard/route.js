import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

 
    const totalUsers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const recentUsers = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name email role createdAt");

  
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title company location createdAt");

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "job",
        select: "title company",
      });

    return NextResponse.json({
      totalUsers,
      totalJobs,
      totalApplications,
      recentUsers,
      recentJobs,
      recentApplications,
    });

  } catch (error) {
    return NextResponse.json(
      { message: `Server Error ${error.message}` },
      { status: 500 }
    );
  }
}