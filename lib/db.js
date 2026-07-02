import mongoose from "mongoose";
import "@/models/user";
import "@/models/student";
import "@/models/recruiter";
import "@/models/job";
import "@/models/application";
import "@/models/notification";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    console.log(error.message)
    throw error;
  }
};