import { Router } from "express";
const router = Router();

import {
  getAllPosture,
  getPosture,
  createPosture,
  updatePosture,
  deletePosture,
} from "../controllers/PostureController.js";
import {
  validatePostureInput,
  validateIdParam2,
} from "../middleware/validationMiddleware.js";
// import upload from "../middleware/multerMiddleware.js";

// router.get('/',getAllPosture)
// router.post("/",createPosture)
// .post(validatePostureInput, upload.single("avatar"), createPosture);

router.route("/").get(getAllPosture).post(validatePostureInput, createPosture);
router
  .route("/:_id")
  .get(validateIdParam2, getPosture)
  .patch(validateIdParam2, updatePosture)
  .delete(validateIdParam2, deletePosture);

export default router;
