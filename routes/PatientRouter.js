import { Router } from "express";
const router = Router();

import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  showStats,
} from "../controllers/PatientController.js";
import {
  validatePatientInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";

// router.get('/', getAllPatients);
// router.post('/', createPatient);

router.route("/").get(getAllPatients).post(validatePatientInput, createPatient);

router.route("/stats").get(showStats);

router
  .route("/:_id")
  .get(validateIdParam, getPatient)
  .patch(validateIdParam, updatePatient)
  .delete(validateIdParam, deletePatient);

export default router;
