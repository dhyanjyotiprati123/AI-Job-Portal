import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Student } from "@/models/student";
import { User } from "@/models/user";


export async function GET(){
   try {
      await connectDB();

      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if(!token){
        return NextResponse.json({message:"Unauthorized"},{status: 401})
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if(decoded.role !== "recruiter"){
        return NextResponse.json({message:"Access Denied"},{status: 403})
      }

      const notifications = await Notification.find({
        user: decoded.id,
      })
        .populate({
          path: "application",
          populate: [
            {
              path: "job",
              select:
                "title company location",
            },
            {
              path: "student",
              select:"location phone",
              populate: {
                path: "user",
                select: "name email",
              },
            },
          ],
        })
        .sort({ createdAt: -1 });

      return NextResponse.json(notifications, {status: 200})
   } catch (error) {
      return NextResponse.json({message: `Server Error ${error.message}`},{status: 500})
   }
}


