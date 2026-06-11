import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Recruiter } from "@/models/recruiter";
import { Application } from "@/models/application";
import { Student } from "@/models/student";
import { Notification } from "@/models/notification";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } =await params;

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const job = await Job.findById(id)
      .populate({
        path: "recruiter",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "applicants",
        populate: [
          {
            path: "student",
            populate: {
              path: "user",
              select: "name email",
            },
          },
          {
            path: "job",
          },
        ],
      });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, {status:200});

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {

    await connectDB();

    const { id } =await params;

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }


    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const applications = await Application.find({ job: id },"_id");

    const applicationIds = applications.map((app) => app._id);

    await Notification.deleteMany({application: { $in: applicationIds },});

    await Application.deleteMany({ job: id });

    await Student.updateMany({ savedJobs: id },{ $pull: { savedJobs: id } });

    await Job.findByIdAndDelete(id);

    return NextResponse.json({ message: "Job deleted successfully" },{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } =await params;
    const body = await req.json();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // ✏️ Update fields
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    return NextResponse.json({message: "Job updated successfully",job: updatedJob,},{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}