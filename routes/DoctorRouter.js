import { Router } from "express";
const router = Router();

import {
  getAllDoctor,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/DoctorController.js";
import {
  validateDoctorInput,
  validateIdParam3,
} from "../middleware/validationMiddleware.js";

// router.get('/',getAllDoctor)
// router.post('/',createDoctor)

router.route("/").get(getAllDoctor).post(validateDoctorInput, createDoctor);

router
  .route("/:_id")
  .get(validateIdParam3, getDoctor)
  .patch(validateIdParam3, updateDoctor)
  .delete(validateIdParam3, deleteDoctor);

export default router;
