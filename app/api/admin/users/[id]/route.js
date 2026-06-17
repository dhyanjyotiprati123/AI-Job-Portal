
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { Student } from "@/models/student";
import { Recruiter } from "@/models/recruiter";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } =await params;

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let extraData = {};

    if (user.role === "student") {
      const student = await Student.findOne({ user: id })
        .populate("savedJobs");
      if(!student){
          return NextResponse.json({message:"Student Not Found"}, {status: 404})
      }  

      const applications = await Application.find({ student: student?._id })
        .populate("job")
        .populate("recruiter");

       if(!applications){
          return NextResponse.json({message:"No Applications Found"}, {status: 404})
       }     

      extraData = {
        studentProfile: student,
        applications,
      };
    }

    if (user.role === "recruiter") {
      const recruiter = await Recruiter.findOne({ user: id });
      if(!recruiter){
          return NextResponse.json({message:"Recruiter Not Found"}, {status: 404})
       } 

      const jobs = await Job.find({ recruiter: recruiter?._id })
            .populate({
              path: "recruiter",
              populate: {
                path: "user",
                select: "name email",
              },
            })
            .populate({
              path: "applicants",
              populate: {
                path: "student",
                populate: {
                  path: "user",
                  select: "name email",
                },
              },
        });
      if(!jobs){
          return NextResponse.json({message:"No jobs Found"}, {status: 404})
       }   

      extraData = {
        recruiterProfile: recruiter,
        jobsPosted: jobs,
      };
    }

    return NextResponse.json({
      user,
      ...extraData,
    });

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } =await params;

    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "student") {
      const student = await Student.findOne({ user: id });

      if (student) {
        const apps = await Application.find({ student: student._id });

        const appIds = apps.map(app => app._id);

        await Job.updateMany({ applicants: { $in: appIds } },{ $pull: { applicants: { $in: appIds } } });
     
        await Notification.deleteMany({application: { $in: appIds }});

        await Application.deleteMany({ student: student._id });

        await Student.findByIdAndDelete(student._id);
      }
    }

    if (user.role === "recruiter") {
      const recruiter = await Recruiter.findOne({ user: id });

      if (recruiter) {
        const jobs = await Job.find({ recruiter: recruiter._id });

        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find(
          {
           $or: [
              { job: { $in: jobIds } },
              { recruiter: recruiter._id }
           ]
          },
         "_id"
        );

        const appIds = applications.map(app => app._id);

        await Notification.deleteMany({application: { $in: appIds }});
        
        await Application.deleteMany({
          $or: [
            { job: { $in: jobIds } },
            { recruiter: recruiter._id }
          ]
        });

        await Job.deleteMany({ recruiter: recruiter._id });

        await Recruiter.findByIdAndDelete(recruiter._id);
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted successfully" },{status: 200});

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" },{ status: 403 });
    }

    const body = await req.json();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" },{ status: 404 });
    }
        if (body.name) {
      user.name = body.name;
    }

    if (body.email) {
      user.email = body.email;
    }

    await user.save();
    
        if (user.role === "student") {
      const student = await Student.findOne({
        user: id,
      });

      if (student) {
        if (body.phone !== undefined) {
          student.phone = body.phone;
        }

        if (body.location !== undefined) {
          student.location = body.location;
        }

        if (body.skills !== undefined) {
          student.skills = body.skills;
        }

        if (body.resume !== undefined) {
          student.resume = body.resume;
        }

        await student.save();
      }
    }
        if (user.role === "recruiter") {
      const recruiter =
        await Recruiter.findOne({
          user: id,
        });

      if (recruiter) {
        if (
          body.companyName !== undefined
        ) {
          recruiter.companyName =
            body.companyName;
        }

        if (body.phone !== undefined) {
          recruiter.phone = body.phone;
        }

        if (
          body.location !== undefined
        ) {
          recruiter.location =
            body.location;
        }

        await recruiter.save();
      }
    }
        return NextResponse.json({ message:"User updated successfully"},{ status: 200 }
    );
  } catch (error) {
    return NextResponse.json({message:`Server error ${error.message}`,},{ status: 500 });
  }
}