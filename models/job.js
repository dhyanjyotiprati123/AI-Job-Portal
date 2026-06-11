import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },
    companyEmail: {
       type: String,
       required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote", "Contract"],
      required: true
    },

    salary: {
      type: String
    },

    description: {
      type: String,
      required: true
    },
    skillsRequired: [
      {
        type: String
      }
    ],

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior"],
      default: "Fresher"
    },

    deadline: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Application"
      }
    ]
  },
  { timestamps: true }
);

export const Job = mongoose.models?.Job || new mongoose.model("Job", jobSchema);
