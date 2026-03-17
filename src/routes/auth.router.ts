import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();
const controller = new AuthController();

authRouter.post("/signup", controller.signup);
authRouter.post("/login", controller.login);
authRouter.get("/verify", controller.verify);
authRouter.post("/refresh", controller.refresh);

export default authRouter;
