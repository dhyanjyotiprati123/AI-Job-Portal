import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
    },

    companyEmail: {
      type: String,
    },

    phone: {
      type: String,
    },

    alternateEmail: {
      type: String,
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },

    industry: {
      type: String,
    },

    companySize: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Recruiter = mongoose.models.Recruiter || mongoose.model("Recruiter", recruiterSchema);