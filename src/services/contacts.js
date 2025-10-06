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

export const updateContactById = async (contactId, contactData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    contactData,
    {
      new: true,
    }
  );
  return updatedContact;
};

export const deleteContactById = async (contactId) => {
  const deleteContact = await Contact.findByIdAndDelete(contactId);
  return deleteContact;
};
