import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchemas.js";
import {
  register,
  login,
  logout,
  getCurrent,
} from "../controllers/userControllers.js";
import { checkAuth } from "../middleware/checkAuth.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerUserSchema), register);
userRouter.post("/login", validateBody(loginUserSchema), login);
userRouter.post("/logout", checkAuth, logout);
userRouter.get("/current", checkAuth, getCurrent);

export default userRouter;
