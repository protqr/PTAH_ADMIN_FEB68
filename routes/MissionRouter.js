// missionRoutes.js
import express from "express";
import {
  getAllMissions,
  createMission,
  getMission,
  updateMission,
  deleteMission,
  createMissionWithSubmissions,
  getAllSubmissions,
  createSubmission,
  getSubmission,
  updateSubmission,
  deleteSubmission
} from "../controllers/MissionController.js";

const router = express.Router();

router.route("/").get(getAllMissions).post(createMission);
router.route("/create-with-sub").post(createMissionWithSubmissions);
router.route("/:id").get(getMission).put(updateMission).delete(deleteMission);
router.route("/").get(getAllSubmissions).post(createSubmission);
router.route("/:id").get(getSubmission).put(updateSubmission).delete(deleteSubmission);

export default router;
