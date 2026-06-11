import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import { Student } from "@/models/student";
import { Recruiter } from "@/models/recruiter";

export async function GET(req,{params}){

 try{
    await connectDB();
    const {id} = await params

    const cookieStore=await cookies();
    const token=cookieStore.get("token")?.value;

    if(!token){
    return NextResponse.json({message:"Unauthorized"},{status:401});
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET);

    const student=await Student.findOne({user:decode.id});

    if(!student){
        return NextResponse.json({message:"Student not found"},{status:404});
    }

    const job=await Job.findById(id).populate("recruiter");

    if(!job){
      return NextResponse.json({message:"Job not found"},{status:404});
     }

     const normalize=(skill)=>
     skill
     .toLowerCase()
     .replace(/\./g,"")
     .replace(/\s+/g,"")
     .trim();

     const studentSkills=
     student.skills.map(normalize);

     const jobSkills=
     job.skillsRequired.map(normalize);

     const matchedSkills=
     job.skillsRequired.filter(skill=>
     studentSkills.includes(
     normalize(skill)
     )
     );

     const percentage=Math.round(
     (matchedSkills.length/
     job.skillsRequired.length)*100
     );

    return NextResponse.json({job,matchPercentage:percentage,matchedSkills});

   }catch(error){
    return NextResponse.json({message:`Server Error ${error.message}`},{status:500});}
 }