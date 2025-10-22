// services/contacts.js
import Contact from '../db/models/Contact.js';

// Tüm kontakları getir, filtrele, sayfalama ve sıralama uygula
export const getAllContacts = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const filter = { userId };

  if (query.isFavourite !== undefined) {
    filter.isFavourite = query.isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContactById = async (contactId, contactData, userId) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
};

export const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
