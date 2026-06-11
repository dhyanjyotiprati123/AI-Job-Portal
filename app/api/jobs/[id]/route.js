
import { Job } from "@/models/job";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, {params}){
   try {
      await connectDB();

      const { id } = await params;

      const job = await Job.findById(id);

      if(!job){
         return NextResponse.json({message: "Job Not Found"}, {status: 404})
      }

      return NextResponse.json(job, {status: 200})
   } catch (error) {
      return NextResponse.json({message: `Server Error ${error.message}`}, {status: 500})
   }
}