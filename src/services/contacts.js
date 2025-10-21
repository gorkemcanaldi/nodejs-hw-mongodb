import Contact from '../db/models/Contact.js';

export const getAllContacts = async (userId) => {
  return Contact.find({ userId });
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newData = await Contact.create(contactData);
  return newData;
};

export const updateContactById = async (contactId, contactData, userId) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
};

export const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
