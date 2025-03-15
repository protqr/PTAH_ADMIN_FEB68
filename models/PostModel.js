import mongoose from "mongoose";
// Reply Schema
const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // อ้างอิงถึง Patient
  postedByPersonnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // อ้างอิงถึง Doctor
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'}, // อ้างอิงถึง Patient
  postedByPersonnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // อ้างอิงถึง Doctor
  replies: [replySchema],
});
  

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    comments: [commentSchema],
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

const Post = mongoose.model("Post", postSchema);

export default Post;
