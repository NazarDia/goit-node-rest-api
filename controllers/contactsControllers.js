import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import Contact from "../db/models/Contact.js";

export const getAllContacts = errorWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const result = await Contact.find({ owner: userId }).populate(
      "owner",
      "_id name email subscription"
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const getOneContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner._id)) {
      throw HttpError(403, "You are not authorized to access this contact");
    }

    const result = await Contact.findById(id).populate(
      "owner",
      "_id name email subscription"
    );

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to remove this contact");
    }

    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const createContact = errorWrapper(async (req, res, next) => {
  const { id } = req.user;
  try {
    const result = await Contact.create({ ...req.body, owner: id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to update this contact");
    }

    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateFavoriteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to update this contact");
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
