
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});

const Otp = mongoose.models.Otp || new mongoose.model("Otp", otpSchema);
export default Otp;