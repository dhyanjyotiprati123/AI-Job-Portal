
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Recruiter } from "@/models/recruiter";
import { Student } from "@/models/student";
import { Application } from "@/models/application";
import { Notification } from "@/models/notification";
import { Job } from "@/models/job";

export async function GET() {
  try {

    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" },{ status: 404 });
    }

    const applications = await Application.find({
      student: student._id
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select: "title company location salary jobType"
      })
      .populate({
        path: "recruiter",
        select: "companyName"
      });

    return NextResponse.json({applications},{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}

export async function DELETE(req) {
  try {

    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await req.json();

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const application = await Application.findOne({
      _id: id,
      student: student._id
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    await Job.findByIdAndUpdate(application.job,{
        $pull: {
        applicants: application._id,
       },
      }
     );

    await Notification.deleteMany({application: application._id,});

    await Application.findByIdAndDelete(id);

    return NextResponse.json({ message: "Application deleted" },{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}