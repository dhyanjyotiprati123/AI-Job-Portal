import { connectDB } from "@/lib/db";
import { Student } from "@/models/student";
import { Job } from "@/models/job";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const student = await Student.findOne({
      user: decoded.id,
    }).populate("user");

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    const prompt = `
    Generate 20 personalized mock interview questions and answers.

    JOB DETAILS:
    Title:
    ${job.title}

    Company:
    ${job.company}

    Required Skills:
    ${job.skillsRequired?.join(", ")}

    Job Description:
    ${job.description}

    STUDENT DETAILS:
    Skills:
    ${student.skills?.join(", ")}

    Strengths:
    ${student.aiAnalysis?.strengths?.join(", ")}

    Weaknesses:
    ${student.aiAnalysis?.weaknesses?.join(", ")}

    RULES:
    - Generate realistic interview questions
    - Include HR questions
    - Include Technical questions
    - Include Project-based questions
    - Answers should be concise but professional
    - Return ONLY valid JSON
    - Do not include markdown

    FORMAT:
    {
      "questions":[
        {
          "question":"",
          "answer":"",
          "type":"HR | Technical | Project",
          "difficulty":"Easy | Medium | Hard"
        }
      ]
    }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = result.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);

  } catch (error) {
    return NextResponse.json(
      {message: `Server Error ${error.message}`,},{status: 500,}
    );
  }
}