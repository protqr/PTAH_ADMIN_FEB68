import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    no: { type: Number, required: true },
    name: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    submission: [
      {
        type: String,
        ref: "submissions",
      },
    ],
    isEvaluate: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// เพิ่ม no ให้เรียงลำดับอัตโนมัติ
MissionSchema.pre("save", async function (next) {
  if (this.no == null) { // ตรวจสอบว่าผู้ใช้ไม่ได้ส่งค่า no มา
    const lastMission = await mongoose.model("Mission").findOne({}, {}, { sort: { no: -1 } });
    this.no = lastMission ? lastMission.no + 1 : 1; // ถ้าไม่มีให้เริ่มที่ 1
  }
  next();
});

export default mongoose.model("Mission", MissionSchema);
