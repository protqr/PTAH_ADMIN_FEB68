import { Router } from "express";
import {
  addNotification,
  deleteNotification,
  findNotification,
  getAllNotifications,
  patchNotification,
  updateNotification,
} from "../controllers/NotificationController.js";

const router = Router();

router.route("/").get(getAllNotifications).post(addNotification);

router
  .route("/:_id")
  .get(findNotification)
  .put(updateNotification)
  .patch(patchNotification)
  .delete(deleteNotification);

export default router;
