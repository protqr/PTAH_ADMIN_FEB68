import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    // หมายเลขภารกิจ
    no: { type: Number, required: true },
    // ชื่อภารกิจ
    name: { type: String, required: true },
    // ภารกิจนี้เสร็จสิ้นแล้วหรือยัง
    isCompleted: { type: Boolean, default: false },
    // อ้างอิงถึง submission หลายตัว
    submission: [
      {
        type: String,
        ref: "submissions",
      },
    ],
    // บางภารกิจอาจมีการประเมิน
    isEvaluate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Mission", MissionSchema);
