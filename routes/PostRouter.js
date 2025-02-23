import express from "express";
import {
  getAllPost,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";

const router = express.Router();

router.route("/").get(getAllPost).post(createPost);
router
  .route("/:_id")
  .get(getPost)
  .patch(updatePost)
  .delete(deletePost);

export default router;
