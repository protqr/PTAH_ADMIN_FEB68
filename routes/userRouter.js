import { Router } from "express";
const router = Router();

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
  getAllAdmin,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/userController.js";
import {
  validateUpdateUserInput,
  validateIdParam4,
} from "../middleware/validationMiddleware.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
router.patch("/update-user", validateUpdateUserInput, updateUser);

router.route("/").get(getAllAdmin).post(createAdmin);

router
  .route("/:_id")
  .get(getAdmin)
  .patch(updateAdmin)
  .delete(deleteAdmin);

export default router;
