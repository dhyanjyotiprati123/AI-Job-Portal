
import { connectDB } from "@/lib/db";
import { Recruiter } from "@/models/recruiter";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const recruiter = await Recruiter.findOne({ user: decoded.id });

    if (!recruiter) {
      return NextResponse.json({ message: "Profile not found" },{ status: 404 });
    }

    return NextResponse.json({ recruiter }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const allowedFields = [
      "companyName",
      "companyEmail",
      "phone",
      "alternateEmail",
      "location",
      "website",
      "industry",
      "companySize",
      "description",
    ];

    const updates = {};

    for (let key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const updatedProfile = await Recruiter.findOneAndUpdate(
      { user: decoded.id },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(
      { message: "Profile updated", recruiter: updatedProfile },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
