// missionRoutes.js
import express from "express";
import {
  getAllMissions,
  createMission,
  getMission,
  deleteMission,
  createMissionWithSubmissions,
  getAllSubmissions,
  createSubmission,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  updateMissionWithSubmissions
} from "../controllers/MissionController.js";

const router = express.Router();

// Mission routes
router.route("/").get(getAllMissions).post(createMission);
router.route("/create-with-sub").post(createMissionWithSubmissions);
router.route("/:id")
  .get(getMission)
  .patch(updateMissionWithSubmissions)
  .delete(deleteMission);

// Submission routes
router.route("/submissions")
  .get(getAllSubmissions)
  .post(createSubmission);
router.route("/submissions/:id")
  .get(getSubmission)
  .patch(updateSubmission)
  .delete(deleteSubmission);

export default router;
