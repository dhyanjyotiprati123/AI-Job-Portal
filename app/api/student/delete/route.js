import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { Student } from "@/models/student";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import { cookies } from "next/headers";
import { Notification } from "@/models/notification";

export async function DELETE(req) {

  try {

    await connectDB();

    const { id } = await req.json();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET);

    if (!decode) {
      return NextResponse.json({ message: "Token expired" },{ status: 400 });
    }

    if (decode.id !== id) {
      return NextResponse.json({message:"You can delete only your own account",},{ status: 403 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "No User Found" },{ status: 404 });
    }

    const student = await Student.findOne({user: id,});

    if(student) {
      const applications = await Application.find({student: student._id},"_id");

      const applicationIds = applications.map((app) => app._id);

      await Job.updateMany(
        {
          applicants: { $in: applicationIds },
        },
        {
          $pull: {
            applicants: { $in: applicationIds },
          },
        }
      );

      await Notification.deleteMany({application: {$in: applicationIds,},});

      await Application.deleteMany({
        student: student._id,
      });

      await Student.findByIdAndDelete(
        student._id
      );
    }

    await User.findByIdAndDelete(id);
     cookieStore.delete("token");

    return NextResponse.json({ message: "Account Deleted" },{ status: 200 });

  } catch (error) {
    return NextResponse.json({message: `Server Error ${error.message}`,},{ status: 500 });
  }
}