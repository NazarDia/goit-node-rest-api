import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const register = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "Email in use");

  const passHash = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(req.body.email);

  const newUser = await User.create({
    email,
    password: passHash,
    avatarURL: avatar,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: avatar,
  });
});

export const login = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isCompare = await bcrypt.compare(password, user.password);

  if (!isCompare) throw HttpError(401, "Email or password is wrong");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: { email, subscription: user.subscription, avatar: user.avatarURL },
  });
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

export const uploadAvatar = errorWrapper(async (req, res, next) => {
  try {
    const { path: tempPath, filename } = req.file;
    const tempFilePath = path.resolve(tempPath);
    const outputDir = path.resolve("public/avatars");
    const outputFilePath = path.join(outputDir, filename);

    const image = await Jimp.read(tempFilePath);
    await image.resize(250, 250).writeAsync(tempFilePath);

    await fs.mkdir(outputDir, { recursive: true });

    await fs.rename(tempFilePath, outputFilePath);

    const avatarURL = `${filename}`;
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    res.status(200).json({ avatarURL: result.avatarURL });
  } catch (error) {
    next(error);
  }
});
