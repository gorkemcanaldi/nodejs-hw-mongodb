import express from 'express';
import cors from 'cors';
import pinohttp from 'pino-http';
import {
  createContact,
  getAllContacts,
  getContactById,
} from './services/contacts.js';

const setupServer = () => {
  const app = express();

  //middleware

  app.use(cors());
  app.use(express.json());

  //pinohttp and pino pretty
  app.use(
    pinohttp({
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    })
  );

  // root
  app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  });

  app.post('/contacts', async (req, res) => {
    try {
      const contactData = req.body;
      const newContact = await createContact(contactData);
      res.status(201).json({
        status: 201,
        message: 'Contact successfully created',
        data: newContact,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: 'Failed to create contact',
        error: error.message,
      });
    }
  });

  //404

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not Found',
    });
  });

  //port

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
export default setupServer;
