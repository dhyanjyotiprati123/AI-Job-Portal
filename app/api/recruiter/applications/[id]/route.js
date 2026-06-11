import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" },{ status: 403 });
    }

    const application = await Application.findById(id)
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "phone location skills resume",
      })
      .populate("job", "title company jobType");

    if (!application) {
      return NextResponse.json({ message: "Application not found" },{ status: 404 });
    }

    return NextResponse.json(application, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}