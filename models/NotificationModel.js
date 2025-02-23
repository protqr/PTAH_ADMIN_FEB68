import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    notifyDate: { type: Date, required: true },
    targetGroup: { type: String, required: true },
    file: {
      id: String,
      name: String,
      url: String,
      size: Number,
    },
    notifyType: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    status: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;

