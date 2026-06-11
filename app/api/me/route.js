import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";     
import { User } from "@/models/user";    

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" },{ status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}
