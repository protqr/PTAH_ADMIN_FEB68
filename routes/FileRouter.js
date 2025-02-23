import { Router } from "express";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

import { createFile, getFile } from "../controllers/FileController.js";

router.route("/").post(upload.single("file"), createFile);

router.route("/:_id").get(getFile);

export default router;
