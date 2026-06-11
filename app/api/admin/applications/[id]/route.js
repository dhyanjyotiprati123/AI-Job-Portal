import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Student } from "@/models/student";
import { Recruiter } from "@/models/recruiter";
import { User } from "@/models/user";
import { Job } from "@/models/job";
import { Notification } from "@/models/notification";

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

    const application = await Application.findById(id)
      .populate({
        path: "student",
        populate: {
          path: "user",
        },
      })
      .populate("job")
      .populate({
        path: "recruiter",
        populate: {
          path: "user",
        },
      });

    if (!application) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(application,{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server error ${error.message}` }, { status: 500 });
  }
}


export async function PATCH(req, {params}){
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token){
      return NextResponse.json({message:"Unauthorized"}, {status: 401})
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if(decode.role !== "admin"){
      return NextResponse.json({message:"Forbidden"}, {status: 403})
    }

    const application = await Application.findById(id);
    if(!application){
       return NextResponse.json({message:"Application Not Found"}, {status: 404})
    }

    const validate = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if(!validate.includes(status)){
      return NextResponse.json({message:"Invalid Status"},{status: 400})
    }

    application.status = status;
    await application.save();

    return NextResponse.json({message:"Application Updated Successfully"}, {status: 200})
  } catch (error) {
     return NextResponse.json({message: `Server Error ${error.message}`},{status: 500})
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

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json({ message: "Application not found" },{ status: 404 });
    }

    await Job.findByIdAndUpdate(application.job,{$pull:{applicants: id}})

    await Notification.deleteMany({application: application._id,});

    await Application.findByIdAndDelete(id);

    return NextResponse.json({ message: "Application deleted" },{status: 200});

  } catch (error) {
    return NextResponse.json({ message: `Server Error ${error.message}` },{ status: 500 });
  }
}