import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { GoogleGenAI } from "@google/genai";

import { connectDB } from "@/lib/db";
import { Student } from "@/models/student";
import { Job } from "@/models/job";

  const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY
  });


  export async function GET(req,{params}){
    try{
    await connectDB();

    const {id} = await params;
    const cookieStore=await cookies();
    const token=cookieStore.get("token")?.value;

    if(!token){
      return NextResponse.json({message:"Unauthorized"},{status:401});
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET);
    const student=await Student.findOne({user:decode.id});
    const job=await Job.findById(id);

    if(!student || !job){
       return NextResponse.json({message:"Data not found"},{status:404});
     }

     const prompt=`
     Analyze whether the student fits this job.
     Return ONLY JSON:
     {
     "fitReason":"",
     "missingSkills":[],
     "strengths":[],
     "weaknesses":[],
     "suggestions":[],
     "interviewTips":[]
     }
     Student Skills:
     ${student.skills.join(",")}
     Student Strengths:
     ${student.aiAnalysis?.strengths.join(",")}
     Student Weaknesses:
     ${student.aiAnalysis?.weaknesses.join(",")}
     Job Title:
     ${job.title}
     Required Skills:
     ${job.skillsRequired.join(",")}
     Job Description:
     ${job.description}
     `;

     const result=
     await ai.models.generateContent({
     model:"gemini-2.5-flash",
     contents:prompt
     });

     let text=result.text;
     text=text
     .replace(/```json/g,"")
     .replace(/```/g,"")
     .trim();

    const parsed= JSON.parse(text);

    return NextResponse.json(parsed);
    }
    catch(error){
      return NextResponse.json({message:`Server Error ${error.message}`},{status:500});
    }

   }