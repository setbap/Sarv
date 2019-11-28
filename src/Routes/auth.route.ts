import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { protect } from "../middleware/auth";

const router = Router();
//signin  route

router.post("/signup", AuthController.signin);
router.post("/validate_user", AuthController.validateUser);
router.post("/login", AuthController.login);
router.post("/reset_password", AuthController.resetPassword);
router.post("/set_new_reset_password", AuthController.setNewresetPassword);
router.post("/get_me", protect, AuthController.getMe);

export default router;
