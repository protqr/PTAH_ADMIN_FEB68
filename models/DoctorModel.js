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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "MPersonnel",
    timestamps: true }
);

export default mongoose.model("Doctor", MPersonnelSchema);
