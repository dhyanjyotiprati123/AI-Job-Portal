import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: String,
  skills: [{type:String}],
  resume: String,
  location: String,

  aiAnalysis:{
    skills:[String],
    strengths:[String],
    weaknesses:[String],
    suggestions:[String],
    analyzedAt:{
      type: Date,
      default: Date.now
    }
  },
  savedJobs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
     }
   ]
}, { timestamps: true });

export const Student = mongoose.models?.Student ||  mongoose.model("Student", studentProfileSchema);
