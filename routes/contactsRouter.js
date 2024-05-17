import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { checkAuth } from "../middleware/checkAuth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", checkAuth, getAllContacts);

contactsRouter.get("/:id", checkAuth, getOneContact);

contactsRouter.delete("/:id", checkAuth, deleteContact);

contactsRouter.post(
  "/",
  checkAuth,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  checkAuth,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  checkAuth,
  validateBody(updateContactFavoriteSchema),
  updateFavoriteContact
);

export default contactsRouter;
