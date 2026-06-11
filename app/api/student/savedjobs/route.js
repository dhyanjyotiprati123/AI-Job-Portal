
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/student";

export async function GET() {
  try {
    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findOne({ user: decoded.id })
      .populate("savedJobs")
      .select("savedJobs");

    if (!student) {
      return NextResponse.json({ message: "Student not found" },{ status: 404 });
    }

    return NextResponse.json(student.savedJobs);

  } catch (error) {
    return NextResponse.json({ message: `Server Error: ${error.message}` },{ status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await req.json();

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" },{ status: 404 });
    }

    await Student.updateOne({ user: decoded.id },{ $pull: { savedJobs: id } });

    return NextResponse.json({message: "Job removed from saved list"},{status: 200});

  } 
  catch (error) {
    return NextResponse.json({ message: `Server Error: ${error.message}` },{ status: 500 });
  }
}