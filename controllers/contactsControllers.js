import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactbyId,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/Wrapper.js";

export const getAllContacts = errorWrapper(async (req, res) => {
  const result = await listContacts();
  res.status(200).send(result);
});

export const getOneContact = errorWrapper(async (req, res) => {
  const result = await getContactById(req.params.id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const deleteContact = errorWrapper(async (req, res) => {
  const result = await removeContact(req.params.id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const createContact = errorWrapper(async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await addContact(name, email, phone);
  res.status(201).json(result);
});

export const updateContact = errorWrapper(async (req, res) => {
  const result = await updateContactbyId(req.params.id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});
