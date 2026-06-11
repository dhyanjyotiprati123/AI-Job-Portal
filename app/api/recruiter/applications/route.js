import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/application";
import { Job } from "@/models/job";
import { Recruiter } from "@/models/recruiter";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { Student } from "@/models/student";
import { Notification } from "@/models/notification";

export async function GET(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const recruiterProfile = await Recruiter.findOne({
      user: decoded.id,
    });

    if (!recruiterProfile) {
      return NextResponse.json({ message: "Recruiter not found" },{ status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    const applications = await Application.find({
      recruiter: recruiterProfile._id,
    })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "job",
        select: "title jobType company",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({
      recruiter: recruiterProfile._id,
    });

    return NextResponse.json(
      {
        applications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}


export async function PATCH(req) {
  try {
    await connectDB();

    const { applicationId, status } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return NextResponse.json({ message: "Invalid application ID" },{ status: 400 });
    }

    const validStatuses = ["Reviewed", "Accepted", "Rejected"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" },{ status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Access denied" },{ status: 403 });
    }

    const recruiterProfile = await Recruiter.findOne({
      user: decoded.id,
    });

    if (!recruiterProfile) {
      return NextResponse.json({ message: "Recruiter not found" },{ status: 404 });
    }

    const application = await Application.findById(applicationId).populate({path:"student",populate:{path:"user"}});

    if (!application) {
      return NextResponse.json({ message: "Application not found" },{ status: 404 });
    }

    if (
      application.recruiter.toString() !==
      recruiterProfile._id.toString()
    ) {
      return NextResponse.json({ message: "Not authorized for this application" },{ status: 403 });
    }

    /* Update status */
    // const previousStatus = application.status;
    application.status = status;
    await application.save();

    console.log(application ,application._id, application.student.user._id)

    const existingNotification = await Notification.findOne({
       user: application.student.user._id,
       title: "Application Accepted",
       application: application._id,
     });

    if(existingNotification){
        return NextResponse.json({message:"Already Exist Duplication Error"},{status: 402})
    } 

    if(status === "Accepted"){
      await Notification.create({
        user: application.student.user._id,
        application: application._id,
        title: "Application Accepted",
        message: `Congratulations! Your application has been accepted.`,   
      });
    }

    return NextResponse.json({ message: `Application ${status}` },{ status: 200 });

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}