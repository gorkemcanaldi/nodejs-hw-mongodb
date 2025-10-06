import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createNewContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', ctrlWrapper(createNewContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));
router.patch('/:contactId', ctrlWrapper(updateContact));
export default router;
