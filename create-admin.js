import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");

    const email = "admin@example.com"; // replace this email with your own email , this is just for example
    const password = "Admin@123"; // replace this password with your own password, this is just for example

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "Administrator", // replace this with your own name
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin account created successfully!");
    console.log("--------------------------------------");
    console.log("Email   :", email);
    console.log("Password:", password);
    console.log("--------------------------------------");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();