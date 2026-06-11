import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Application",
       required: true
    },

    title: String,

    message: String,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);