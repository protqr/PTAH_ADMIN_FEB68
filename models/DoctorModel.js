import mongoose from "mongoose";
import { PREFIXDOCTOR } from "../utils/constants.js";

const MPersonnelSchema = new mongoose.Schema(
  {
    nametitle: {
      type: String,
      enum: Object.values(PREFIXDOCTOR),
      default: PREFIXDOCTOR.PF_MD1,
    },
    name: String,
    surname: String,
    username: String,
    tel: String,
    email: String,
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "MPersonnel",
    timestamps: true }
);

export default mongoose.model("Doctor", MPersonnelSchema);
