import { connectDB } from "@/lib/db";
import { Student } from "@/models/student";
import { Job } from "@/models/job";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const student = await Student.findOne({user: decoded.id,}).populate("user");

    if (!student) {
      return NextResponse.json({ message: "Student not found" },{ status: 404 });
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" },{ status: 404 });
    }

    const prompt = `
    Generate a professional personalized cover letter.

    STUDENT DETAILS:
    Name:
    ${student.user?.name}

    Skills:
    ${student.skills?.join(", ")}

    Strengths:
    ${student.aiAnalysis?.strengths?.join(", ")}

    JOB DETAILS:
    Title:
    ${job.title}

    Company:
    ${job.company}

    Required Skills:
    ${job.skillsRequired?.join(", ")}

    Job Description:
    ${job.description}

    RULES:
    - Professional tone
    - Maximum 400 words
    - Mention matching skills
    - Mention why candidate fits role
    - Do not use placeholders
    - Return only plain text
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response = result.text;

    return NextResponse.json(
      { coverLetter: response,},{ status: 200,}
    );
  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}`,},{status: 500,});
  }
}