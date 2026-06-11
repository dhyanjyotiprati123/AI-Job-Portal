
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { Student } from "@/models/student";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(req){
   try {
     await connectDB();

     const cookieStore = await cookies();
     const token = cookieStore.get("token")?.value;

     if(!token){
        return NextResponse.json({message:"Unauthorized"}, {status: 401})
     };

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const id = decoded.id;

     const formData = await req.formData();
     const file = formData.get("resume");

     if(!file){
       return NextResponse.json({message:"No file uploaded"}, {status: 400})
     }

     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes);

     const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "student_resumes",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const student = await Student.findOne({user: id});

    if(!student){
      return NextResponse.json({message:"No student Found By this id"}, {status: 404})
    }

    student.resume = upload.secure_url;
    await student.save();

    return NextResponse.json({message:"Resume Uploaded Successfully"}, {status: 200});

   } catch (error) {
     return NextResponse.json({message:`server error ${error.message}`}, {status: 500})
   }
}
