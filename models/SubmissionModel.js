import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    // ตัวอย่างฟิลด์ submission
    name: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    // บางครั้งจะมีการประเมิน submission
    isEvaluated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("submissions", SubmissionSchema);
