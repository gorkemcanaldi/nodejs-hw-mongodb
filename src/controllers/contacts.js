import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import { saveFileCloud } from '../utils/saveFileCloud.js';

export const getContacts = async (req, res) => {
  const result = await getAllContacts(req.user._id, req.query);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: result,
  });
};

export const getContact = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileCloud(photo);
  }

  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const updatedData = { ...req.body };

  if (req.file) {
    const photoUrl = await saveFileCloud(req.file);
    updatedData.photo = photoUrl;
  }

  const updatedContact = await updateContactById(
    req.params.contactId,
    updatedData,
    req.user._id
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const deletedContact = await deleteContactById(
    req.params.contactId,
    req.user._id
  );

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact successfully deleted',
    data: deletedContact,
  });
};
