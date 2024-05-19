import express from "express";
import contactsRouter from "./contactsRouter.js";
import userRouter from "./userRouter.js";

const router = express.Router();
router.use("/contacts", contactsRouter);
router.use("/users", userRouter);

export default router;
