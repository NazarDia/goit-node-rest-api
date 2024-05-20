import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import Contact from "../db/models/Contact.js";

export const getAllContacts = errorWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await Contact.find({ owner: userId }).populate(
    "owner",
    "_id name email subscription"
  );
  res.status(200).json(result);
});

export const getOneContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await Contact.findOne({ _id: id, owner: userId }).populate(
    "owner",
    "_id name email subscription"
  );
  if (!result) throw HttpError(404);
  res.status(200).json(result);
});

export const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id, owner: userId });
  if (!result) throw HttpError(404);
  res.status(200).json(result);
});

export const createContact = errorWrapper(async (req, res, next) => {
  const { id } = req.user;
  const result = await Contact.create({ ...req.body, owner: id });
  res.status(201).json(result);
});

export const updateContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    req.body,
    { new: true }
  );
  if (!result) throw HttpError(404);
  res.status(200).json(result);
});

export const updateFavoriteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { id: userId } = req.user;

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { favorite },
    { new: true }
  );

  if (!result) throw HttpError(404);

  res.status(200).json(result);
});
