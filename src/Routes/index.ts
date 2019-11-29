import { Router, Request, Response } from "express";
import auth from "./userAuth.route";
import orgAuth from "./orgAuth.route";

const routes = Router();

routes.use("/api/auth", auth);
routes.use("/api/org_auth", orgAuth);

export default routes;
