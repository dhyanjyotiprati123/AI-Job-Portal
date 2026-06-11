import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const jobs = await Job.find();

    return NextResponse.json(jobs, {status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}