import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";
import Contact from "../db/models/Contact.js";
import { isValidObjectId } from "mongoose";

export const getAllContacts = errorWrapper(async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const getOneContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid contact id");
    }

    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid contact id");
    }

    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const createContact = errorWrapper(async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const contact = { name, email, phone, favorite };
  try {
    const result = await Contact.create(contact);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const contact = { name, email, phone, favorite };
  try {
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid contact id");
    }

    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const updateFavoriteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid contact id");
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});
