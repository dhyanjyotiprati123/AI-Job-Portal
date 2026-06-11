
import { Job } from "@/models/job";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const jobType = searchParams.get("jobType");
    const location = searchParams.get("location");
    const experienceLevel = searchParams.get("experience");

    let query = {};

    if (jobType) {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query);

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}