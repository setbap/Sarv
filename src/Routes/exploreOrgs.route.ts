import { Router } from "express";
import { ExploreOrgsController } from "../Controllers/exploreOrg.controller";
import { userProtect } from "../middleware/auth";
import * as fileupload from "express-fileupload";

const router = Router();
//signin  route

router.post("/best_orgs", ExploreOrgsController.bestOrg);
router.post("/rate_org", userProtect("user"), ExploreOrgsController.rateOrg);
// router.post("/distant_search", ExploreToursController.distantSearch);
// router.post("/full_search", ExploreToursController.fullSearch);
// router.post("/rate_tour", userProtect("user"), ExploreToursController.rateTour);
router.post(
  "/comment_org",
  userProtect("user"),
  ExploreOrgsController.commentOrg
);

router.post("/orgs/:id", ExploreOrgsController.singleOrg);

export default router;
