import { Router, Request, Response } from "express";
import auth from "./userAuth.route";
// import user from "./user";

const routes = Router();

routes.use("/api/auth", auth);
// routes.use("/user", user);

export default routes;
