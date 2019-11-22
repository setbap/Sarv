import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
//signin  route

router.post("/signup", AuthController.signin);

export default router;
