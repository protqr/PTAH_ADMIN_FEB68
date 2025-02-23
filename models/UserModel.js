import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    name: String,
    email: String,
    password: String,
    surname: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
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
  { collection: "Admin", timestamps: true }
);

AdminSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", AdminSchema);