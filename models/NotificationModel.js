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
    deletedAt: {
      type: Date,
      default: null,
      // กำหนด TTL index ที่จะลบเอกสารหลัง 30 วัน (2592000 วินาที)
      index: {
        expireAfterSeconds: 2592000, // 30 days
        partialFilterExpression: { isDeleted: true },
      },
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;

