import Contact from '../db/Contact.js';

export const getAllContacts = async () => {
  return Contact.find();
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  const newData = await Contact.create(contactData);
  return newData;
};
