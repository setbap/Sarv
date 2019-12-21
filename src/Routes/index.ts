import { Router, Request, Response } from "express";
import auth from "./userAuth.route";
import orgAuth from "./orgAuth.route";
import manageTour from "./manageTour.route";
import exploreTours from "./exploreTours.route";
import exploreOrgs from "./exploreOrgs.route";

const routes = Router();

routes.use("/api/auth", auth);
routes.use("/api/org_auth", orgAuth);
routes.use("/api/manage_tour", manageTour);
routes.use("/api/explore_tours", exploreTours);
routes.use("/api/explore_orgs", exploreOrgs);

export default routes;
