
import { NextResponse } from "next/server";
import Otp from "@/models/otp";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, otp } = await req.json();

    const record = await Otp.findOne({ email });

    if (!record) {
      return NextResponse.json({ message: "OTP not found" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await Otp.deleteOne({ email });

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}