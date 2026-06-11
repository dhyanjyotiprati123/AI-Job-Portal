import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json( { message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET);

    const notification =
      await Notification.findOne({
        _id: id,
        user: decoded.id,
      })
      .populate({
        path: "application",
        populate: [
          {
            path: "job",
            select: "title company",
          },
          {
            path: "student",
            populate: {
              path: "user",
              select: "name email",
            },
          },
        ],
      });

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" },{ status: 404 });
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json(
      {
        message: "Notification marked as read",
        notification,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Server Error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}