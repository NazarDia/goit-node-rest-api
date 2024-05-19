import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  user && next(HttpError(409, "Email in use"));

  const passHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: passHash,
  });

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
});

export const login = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  !user && next(HttpError(401, "Email or password is wrong"));

  const isCompare = await bcrypt.compare(password, user.password);

  !isCompare && next(HttpError(401, "Email or password is wrong"));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });

  await User.findByIdAndUpdate(user._id, { token });
  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
});

export const logout = errorWrapper(async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).end();
});

export const getCurrent = errorWrapper(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});
