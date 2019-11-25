import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
//signin  route

router.post("/signup", AuthController.signin);
router.post("/validate_user", AuthController.validateUser);
router.post("/login", AuthController.login);

export default router;
