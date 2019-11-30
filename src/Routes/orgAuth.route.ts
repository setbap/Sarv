import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller";
import { protect } from "../middleware/auth";
import { OrgAuthController } from "../Controllers/orgAuth.controller";

const router = Router();
//signin  route

router.post("/org_create", protect, OrgAuthController.orgCreate);
router.post("/org_login", OrgAuthController.orgLogin);
router.post("/org_accept", OrgAuthController.orgAccept);
router.post("/org_reset_password", OrgAuthController.orgResetPassword);
router.post(
  "/org_set_new_reset_password",
  OrgAuthController.orgSetNewresetPassword
);
router.post("/get_me", protect, OrgAuthController.getMe);

export default router;
