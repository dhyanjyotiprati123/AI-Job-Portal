import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Student } from "@/models/student";
import { Recruiter } from "@/models/recruiter";
import { User } from "@/models/user";
import { Job } from "@/models/job";

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


    const applications = await Application.find()
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "job",
        select: "title company location",
      })
      .populate({
        path: "recruiter",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    return NextResponse.json(applications, {status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}