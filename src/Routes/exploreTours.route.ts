import { Router } from "express";
import { ExploreToursController } from "../Controllers/exploreTours.controller";
import { userProtect } from "../middleware/auth";

const router = Router();
//signin  route

router.post("/lastest_tours", ExploreToursController.lastestTour);
router.post("/distant_search", ExploreToursController.distantSearch);
router.post("/full_search", ExploreToursController.fullSearch);
router.post("/rate_tour", userProtect("user"), ExploreToursController.rateTour);
router.post(
  "/comment_tour",
  userProtect("user"),
  ExploreToursController.commentTour
);

router.post("/tours/:id", ExploreToursController.singleTour);

export default router;
