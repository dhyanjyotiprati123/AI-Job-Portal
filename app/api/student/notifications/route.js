import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const notifications = await Notification.find({
      user: decoded.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      notifications,
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ message: `Server Error: ${error.message}`,},{ status: 500 });
   }
 }