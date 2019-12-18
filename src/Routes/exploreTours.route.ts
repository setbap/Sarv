import { Router } from "express";
import { UserAuthController } from "../Controllers/userAuth.controller";
import { userProtect } from "../middleware/auth";
import { OrgAuthController } from "../Controllers/orgAuth.controller";
import { ExploreToursController } from "../Controllers/exploreTours.controller";

const router = Router();
//signin  route

router.post("/lastest_tours", ExploreToursController.lastestTour);

export default router;
