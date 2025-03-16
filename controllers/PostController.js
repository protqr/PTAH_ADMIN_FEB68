import { StatusCodes } from "http-status-codes";
import Post from "../models/PostModel.js";
import { NotFoundError } from "../errors/customError.js";
import mongoose from "mongoose"; // ✅ เพิ่ม import mongoose


// Get all posts
export const getAllPost = async (req, res) => {
  const { search, sort, isDeleted } = req.query;

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }

  if (search) {
    queryObject.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions = {
    ใหม่ที่สุด: "-createdAt",
    เก่าที่สุด: "createdAt",
    "เรียงจาก ก-ฮ": "title",
    "เรียงจาก ฮ-ก": "-title",
  };

  const sortKey = sortOptions[sort] || sortOptions["ใหม่ที่สุด"];
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // ดึงโพสต์ทั้งหมดพร้อม populate ชื่อผู้โพสต์
    const posts = await Post.find(queryObject)
      .populate("postedBy", "name surname") // populate ชื่อผู้โพสต์โพสต์
      .populate("comments.postedByUser", "name surname") // populate ชื่อผู้โพสต์ความคิดเห็น (ถ้าเป็น Patient)
      .populate("comments.postedByPersonnel", "nametitle name surname") // populate ชื่อผู้โพสต์ความคิดเห็น (ถ้าเป็น Doctor)
      .populate("comments.replies.postedByUser", "name surname") // populate ชื่อผู้ตอบกลับ (ถ้าเป็น Patient)
      .populate("comments.replies.postedByPersonnel", "nametitle name surname") // populate ชื่อผู้ตอบกลับ (ถ้าเป็น Doctor)
      .sort(sortKey)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalPosts / limit);

    res
      .status(StatusCodes.OK)
      .json({ totalPosts, numOfPages, currentPage: page, posts });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, content, tag, postedBy } = req.body;

  const newPost = await Post.create({ title, content, tag, postedBy });
  res.status(StatusCodes.CREATED).json({ post: newPost });
};


// Get a single post
export const getPost = async (req, res) => {
  try {
    const postId = req.params._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid ID format" });
    }

    // ค้นหาโพสต์ตาม ID และ populate ชื่อผู้โพสต์ความคิดเห็นและผู้ตอบกลับ
    const post = await Post.findById(postId)
      .populate("postedBy", "name surname") // populate ชื่อผู้โพสต์โพสต์
      .populate("comments.postedByUser", "name surname") // populate ชื่อผู้โพสต์ความคิดเห็น (ถ้าเป็น Patient)
      .populate("comments.postedByPersonnel", "nametitle name surname") // populate ชื่อผู้โพสต์ความคิดเห็น (ถ้าเป็น Doctor)
      .populate("comments.replies.postedByUser", "name surname") // populate ชื่อผู้ตอบกลับ (ถ้าเป็น Patient)
      .populate("comments.replies.postedByPersonnel", "nametitle name surname"); // populate ชื่อผู้ตอบกลับ (ถ้าเป็น Doctor)

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No post with id: ${postId}` });
    }

    res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true }
  );

  if (!updatedPost)
    throw new NotFoundError(`No post with id: ${req.params._id}`);

  res.status(StatusCodes.OK).json({ post: updatedPost });
};

export const deletePost = async (req, res) => {
  const { _id } = req.params;

  const deletedPost = await Post.findByIdAndDelete(_id);

  if (!deletedPost) {
    throw new NotFoundError(`No post with id: ${_id}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Post deleted successfully", post: deletedPost });
};
