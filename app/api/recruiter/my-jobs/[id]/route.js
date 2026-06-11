
import { NextResponse } from "next/server";
import { Job } from "@/models/job";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB()

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

    return NextResponse.json({ job }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}