
import { NextResponse } from "next/server";
import { User } from "@/models/user";
import Otp from "@/models/otp";
import { sendOtpEmail } from "@/utils/sendMail";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent" });

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}