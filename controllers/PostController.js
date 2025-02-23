import { StatusCodes } from "http-status-codes";
import Post from "../models/PostModel.js";
import { NotFoundError } from "../errors/customError.js";

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

  const posts = await Post.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalPosts / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalPosts, numOfPages, currentPage: page, posts });
};

export const createPost = async (req, res) => {
  const { title, content, tag, postedBy } = req.body;

  const newPost = await Post.create({ title, content, tag, postedBy });
  res.status(StatusCodes.CREATED).json({ post: newPost });
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params._id);
  if (!post) throw new NotFoundError(`No post with id: ${req.params._id}`);
  res.status(StatusCodes.OK).json({ post });
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
