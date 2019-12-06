import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller";
import { userProtect } from "../middleware/auth";
import { OrgAuthController } from "../Controllers/orgAuth.controller";

const router = Router();
//signin  route

router.post("/org_create", userProtect("user"), OrgAuthController.orgCreate);
router.post("/org_login", OrgAuthController.orgLogin);
router.post("/org_accept", OrgAuthController.orgAccept);
router.post("/org_reset_password", OrgAuthController.orgResetPassword);
router.post(
  "/org_set_new_reset_password",
  OrgAuthController.orgSetNewresetPassword
);
router.post("/get_me", userProtect("org"), OrgAuthController.getMe);

export default router;
