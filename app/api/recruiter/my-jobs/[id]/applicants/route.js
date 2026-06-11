
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { Job } from "@/models/job";
// import jwt from "jsonwebtoken";
// import { Recruiter } from "@/models/recruiter";
// import { connectDB } from "@/lib/db";
// import { Application } from "@/models/application";
// import { Student } from "@/models/student";

// export async function GET(req,{params}){
//     try {
//         await connectDB();

//         const cookieStore = await cookies();
//         const token = cookieStore.get("token")?.value;
//         const { id } = await params;

//         if(!token){
//             return NextResponse.json({message:"Unauthorized"}, {status: 401});
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const recruiter = await Recruiter.findOne({user: decoded.id});

//         if(!recruiter){
//             return NextResponse.json({message:"No Recruiter Found"}, {status: 404})
//         }

//         const job = await Job.findOne({ _id: id, recruiter: recruiter._id});

//         if(!job){
//             return NextResponse.json({message:"Job Not Found"}, {status: 404})
//         }

//        const applications = await Application.find({ job: id })
//          .populate({
//           path: "student",
//           populate: {
//             path: "user",
//             select: "name email",
//          },
//          select: "phone location",
//        })
//        .sort({ createdAt: -1 });

//         if(!applications){
//             return NextResponse.json({message:"No applications Found"}, {status: 404})
//         }

//         return NextResponse.json(applications,{status: 200})
//     } catch (error) {
//         return NextResponse.json({message:`Server Error ${error.message}`},{status: 500})
//     }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Student } from "@/models/student";
import { User } from "@/models/user";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" },{ status: 404 });
    }

    const applications = await Application.find({
      job: id,
    })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    const applicantsWithMatch = applications.map((app) => {
      const studentSkills = app.student?.skills || [];
      const requiredSkills = job.skillsRequired || [];

      const normalizeSkill = (skill) => {
          return skill
         .toLowerCase()
         .replace(/\./g, "")      // React.js -> reactjs
         .replace(/apis?/g, "api") // APIs -> api
         .replace(/\s+/g, "")     // remove spaces
         .trim();
};

      const matchedSkills = requiredSkills.filter((required) =>
        studentSkills.some(
          (skill) =>
          normalizeSkill(skill) === normalizeSkill(required)
         )
        );

      const missingSkills = requiredSkills.filter(
        (required) =>
          !studentSkills.some(
            (skill) =>
              normalizeSkill(skill) === normalizeSkill(required)
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

    return NextResponse.json(applicantsWithMatch,{ status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Server Error: ${error.message}` },{ status: 500 });
  }
}