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
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const filter = {};
    if (req.query.isFavourite !== undefined) {
      filter.isFavourite = req.query.isFavourite === 'true';
    }

    const totalItems = await getAllContacts(userId, filter).then(
      (c) => c.length
    );
    const totalPages = Math.ceil(totalItems / perPage);

    const contacts = await getAllContacts(userId, filter).then((all) =>
      all
        .sort((a, b) =>
          sortOrder === 1
            ? a[sortBy]?.localeCompare(b[sortBy])
            : b[sortBy]?.localeCompare(a[sortBy])
        )
        .slice((page - 1) * perPage, page * perPage)
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewContact = async (req, res, next) => {
  try {
    const contactData = {
      ...req.body,
      userId: req.user._id,
    };

    const newContact = await createContact(contactData);
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
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedData = req.body;

    const updatedContact = await updateContactById(
      contactId,
      updatedData,
      userId
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
    const { contactId } = req.params;
    const userId = req.user._id;

    const deletedContact = await deleteContactById(contactId, userId);
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
