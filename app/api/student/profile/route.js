import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/models/student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const student = await Student.findOne({ user: decoded.id }).populate({
      path:"user",
      select:"name email"
    })

    if (!student) {
      return NextResponse.json({ message: "Profile not found" },{ status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message },{ status: 500 });}
}

export async function PUT(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { phone, skills, location, resume } = await req.json();

    const updatedStudent = await Student.findOneAndUpdate(
      { user: decoded.id },
      {
        phone,
        skills,
        location,
        resume,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully", data: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}