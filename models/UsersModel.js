// models/UserModel.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: { type: String },
    surname: { type: String },
    tel: { type: String },
    gender: { type: String },
    birthday: { type: Date },
    ID_card_number: { type: String },
    address: { type: String },
    physicalTherapy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);

export default mongoose.model("Users", UserSchema);
