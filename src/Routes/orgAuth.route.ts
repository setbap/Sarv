import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller"
import { protect } from "../middleware/auth";

const router = Router();
//signin  route

router.post("/signup", UserAuthController.signin);
router.post("/validate_user", UserAuthController.validateUser);
router.post("/login", UserAuthController.login);
router.post("/reset_password", UserAuthController.resetPassword);
router.post("/set_new_reset_password", UserAuthController.setNewresetPassword);
router.post("/get_me", protect, UserAuthController.getMe);

export default router;
