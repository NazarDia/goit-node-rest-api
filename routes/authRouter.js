import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  getCurrent,
} from "../controllers/authControllers.js";
import { checkAuth } from "../middleware/checkAuth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/logout", checkAuth, logout);
authRouter.get("/current", checkAuth, getCurrent);

export default authRouter;
