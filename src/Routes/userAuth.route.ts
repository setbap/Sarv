import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller"
import { userProtect } from "../middleware/auth";

const router = Router();
//signin  route

router.post("/signup", UserAuthController.signin);
router.post("/validate_user", UserAuthController.validateUser);
router.post("/login", UserAuthController.login);
router.post("/reset_password", UserAuthController.resetPassword);
router.post("/set_new_reset_password", UserAuthController.setNewresetPassword);
router.post("/change_password", userProtect("user"), UserAuthController.authedChangePassword);
router.post("/get_me", userProtect("user"), UserAuthController.getMe);
router.post("/set_update_me", userProtect("user"), UserAuthController.updateInfoInter);
router.post("/i_want_to_be_tour_leader", userProtect("user"), UserAuthController.iWantToBeTourLeader);

export default router;
