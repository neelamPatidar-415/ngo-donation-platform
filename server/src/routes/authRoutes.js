
import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/authValidator.js";

import { getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = Router();

router.get("/me", protect, getMe);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
     