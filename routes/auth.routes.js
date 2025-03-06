import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

// as soon as somebody hits this endpoint theaht function will be executed
authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

export default authRouter;
