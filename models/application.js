import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required: true
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    resume:{
        type: String
    },
    coverLetter:{
        type: String,
        required: true
    },
    status:{
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    }
},{timestamps: true});

applicationSchema.index(
  { student: 1, job: 1 },
  { unique: true }
);


export const Application = mongoose.models?.Application || new mongoose.model("Application", applicationSchema)