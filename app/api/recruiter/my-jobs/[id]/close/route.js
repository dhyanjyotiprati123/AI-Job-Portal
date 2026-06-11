
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Job } from "@/models/job";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const {id} = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    job.isActive = false;
    await job.save();

    return NextResponse.json({ message: "Job closed successfully" },{ status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Server Error ${error.message}` }, { status: 500 });
  }
}