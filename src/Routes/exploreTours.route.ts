import { Router } from "express";
import { ExploreToursController } from "../Controllers/exploreTours.controller";

const router = Router();
//signin  route

router.post("/lastest_tours", ExploreToursController.lastestTour);
router.post("/distant_search", ExploreToursController.distantSearch);

export default router;
