import mongoose from "mongoose";
import { TYPEPOSTURES } from "../utils/constants.js";

const PostureSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: Object.values(TYPEPOSTURES),
      default: TYPEPOSTURES.TYPE_1,
    },
    namePostures: String,
    noPostures: String,
    isEvaluate: {
      type: Boolean,
      default: false,
    },
    imageUrls: [String], // Changed from imageUrl: String
    videoUrls: [String], // Changed from videoUrl: String
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
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

export default mongoose.model("Posture", PostureSchema);

// import mongoose from "mongoose";
// import { TYPEPOSTURES } from "../utils/constants.js";

// const PostureSchema = new mongoose.Schema(
//   {
//     userType: {
//       type: String,
//       enum: Object.values(TYPEPOSTURES),
//       default: TYPEPOSTURES.TYPE_1,
//     },
//     namePostures: String,
//     noPostures: String,
//     Description: String,
//     imageUrl: String,
//     videoUrl: String,
//     createdBy: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Posture", PostureSchema);
