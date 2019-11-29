import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller";
import { protect } from "../middleware/auth";
import { OrgAuthController } from "../Controllers/orgAuth.controller";

const router = Router();
//signin  route

router.post("/org_create", protect, OrgAuthController.orgCreate);
router.post("/org_login", OrgAuthController.orgLogin);
// router.post("/reset_password", UserAuthController.resetPassword);
// router.post("/set_new_reset_password", UserAuthController.setNewresetPassword);
// router.post("/get_me", protect, UserAuthController.getMe);

export default router;
