
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import { Student } from "@/models/student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Application } from "@/models/application";

export async function GET(req,{params}){
 try{
   await connectDB();

   const { id } = await params;
   const cookieStore = await cookies();
   const token = cookieStore.get("token")?.value;

   if(!token){
     return NextResponse.json({message:"Unauthorized"},{status:401});
   }

   const decoded = jwt.verify(token,process.env.JWT_SECRET);

   const job = await Job.findById(id);

   if(!job){
      return NextResponse.json({message:"Job not found"},{status:404});
    }

   const applications = await Application.find({ job: id })
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email",
    },
   })
   .populate({
      path: "job",
      select: "title company jobType skillsRequired",
  })
  .sort({ createdAt: -1 });

    const applicationsWithMatch = applications.map((app) => {

    const studentSkills = app.student?.skills || [];
    const requiredSkills = app.job?.skillsRequired || [];

    const matchedSkills =
      requiredSkills.filter((skill) =>
        studentSkills.some(
          (s) =>
            s.toLowerCase() === skill.toLowerCase()
        )
      );

    const missingSkills =
      requiredSkills.filter((skill) =>
        !studentSkills.some(
          (s) =>
            s.toLowerCase() === skill.toLowerCase()
        )
      );

    const matchPercentage =
      requiredSkills.length > 0
        ? Math.round(
            (matchedSkills.length /
              requiredSkills.length) *
              100
          )
        : 0;

      let verdict = "Weak Fit";

      if (matchPercentage >= 80) {
        verdict = "Excellent Fit";
      } else if (matchPercentage >= 60) {
        verdict = "Good Fit";
      } else if (matchPercentage >= 40) {
        verdict = "Average Fit";
      }

      return {
        ...app.toObject(),
        matchPercentage,
        matchedSkills,
        missingSkills,
        verdict,
      };
   });

   applicationsWithMatch.sort(
       (a, b) => b.matchPercentage - a.matchPercentage
   );

   return NextResponse.json(applicationsWithMatch,{status:200});

 }

 catch(error){
   return NextResponse.json({ message:`Server Error ${error.message}`},{status:500});
 }

}