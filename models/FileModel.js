import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: String,
    size: Number,
    public_id: String,
    url: String,
    secure_url: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", FileSchema);
