import { Router, Request, Response } from "express";
import auth from "./userAuth.route";
import orgAuth from "./orgAuth.route";
import manageTour from "./manageTour.route";

const routes = Router();

routes.use("/api/auth", auth);
routes.use("/api/org_auth", orgAuth);
routes.use("/api/manage_tour", manageTour);

export default routes;
