// controllers/contacts.js
import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const result = await getAllContacts(req.user._id, req.query);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewContact = async (req, res, next) => {
  try {
    const newContact = await createContact({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await updateContactById(
      req.params.contactId,
      req.body,
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
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
