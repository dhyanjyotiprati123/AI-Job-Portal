
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import pdfParse from "pdf-parse";
import { Student } from "@/models/student";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";

const ai =new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})


export async function POST(req){
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({message:"Unauthorized"},{status: 401})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const { resumeUrl } = await req.json();

        const response = await fetch(resumeUrl);

        if(!response.ok){
            return NextResponse.json({message:"failed load resume"}, {status: 400})
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData =await pdfParse(buffer);
        const resumeText = pdfData.text;

        const prompt = `
          Analyze this resume.

          Return ONLY valid JSON.
          
          Format:

          {
             "skills": [],
             "strengths": [],
             "weaknesses": [],
             "suggestions": []
          }

          Resume:

          ${resumeText}
          `;

    // Gemini response
       const result = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: prompt,
       });

       const text = result.text;
       const cleanText = text
         .replace(/```json/g, "")
         .replace(/```/g, "")
         .trim();

       let parsedResult;

       try {
          parsedResult = JSON.parse(cleanText);
          const student = await Student.findOne({ user: decode.id })
            .populate({
             path: "user",
             model: User,
          });

          if(!student){
             return NextResponse.json({message:"Student Not Found"}, {status:400})
          };

          student.aiAnalysis = parsedResult;
          student.skills = parsedResult.skills;
          await student.save();
       } catch (err) {

         console.log("Invalid JSON from Gemini:");
         console.log(cleanText);

         parsedResult = {
           skills: [],
           strengths: [],
           weaknesses: [],
           suggestions: [
             "AI returned malformed JSON"
           ]
         };
       }

    return NextResponse.json(parsedResult, {status: 200})      
    } catch (error) {
        return NextResponse.json({message:`Server Error ${error.message}`}, {status: 500})
    }
}

