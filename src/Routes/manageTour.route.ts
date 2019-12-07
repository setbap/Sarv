import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller";
import { userProtect } from "../middleware/auth";
import { OrgAuthController } from "../Controllers/orgAuth.controller";
import { ManageTourController } from "../Controllers/manageTours.controller";

const router = Router();
//signin  route

router.post("/tour_create", userProtect("org"), ManageTourController.orgCreate);


export default router;
