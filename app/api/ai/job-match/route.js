import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Student } from "@/models/student";
import { Job } from "@/models/job";

export async function GET() {

  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET);

    const student = await Student.findOne({
      user: decode.id
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" },{ status: 404 });
    }

    const studentSkills =student.aiAnalysis?.skills || [];

    const jobs = await Job.find({isActive: true});

    const matchedJobs = jobs.map((job) => {

    const jobSkills =job.skillsRequired;

    const normalizeSkill = (skill) => {
     return skill
     .toLowerCase()
     .trim()
     .replace(/\./g, "")     // remove dots
     .replace(/\s+/g, "")    // remove spaces
     .replace(/-/g, "")      // remove hyphens
    };

     const matchedSkills = jobSkills.filter(
      (skill) =>
        studentSkills.some(
          (studentSkill) =>
            normalizeSkill(studentSkill) ===
            normalizeSkill(skill)
        )
    );

    const missingSkills = jobSkills.filter(
       (skill) =>
         !studentSkills.some(         
           (studentSkill) =>
             normalizeSkill(studentSkill) ===
             normalizeSkill(skill)
         )
     );

    const matchPercentage =
        Math.round(
          (matchedSkills.length /
          jobSkills.length) * 100
        ) || 0;

      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        experienceLevel:
        job.experienceLevel,
        jobType: job.jobType,
        matchedSkills,
        missingSkills,
        matchPercentage
      };

    }).filter((job)=>job.matchPercentage >= 30).sort((a,b)=>b.matchPercentage-a.matchPercentage);

    matchedJobs.sort(
      (a,b) =>
      b.matchPercentage -
      a.matchPercentage
    );

    return NextResponse.json(matchedJobs,{status:200});
  }
  catch(error){
    return NextResponse.json({message:` Server Error ${error.message}`},{status:500});
  }

}