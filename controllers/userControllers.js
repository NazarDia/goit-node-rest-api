import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const { BASE_URL } = process.env;

export const register = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "Email in use");

  const passHash = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(req.body.email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    email,
    password: passHash,
    avatarURL: avatar,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"> Click here to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: avatar,
    message: "User registered successfully!",
  });
});

export const login = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isCompare = await bcrypt.compare(password, user.password);

  if (!isCompare) throw HttpError(401, "Email or password is wrong");

  if (!user.verify)
    throw HttpError(
      403,
      "User not verified. Please check your email to verify your account."
    );

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
});
export const verifyUser = errorWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) throw res.status(404).json({ message: "User not found" });

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
});

export const newVerifyEmail = errorWrapper(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"> Click here to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
});
