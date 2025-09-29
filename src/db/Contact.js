import mongoose, { Schema } from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true } //createdAt ve updatedAt otomatik olcak
);

const Contact = mongoose.model('contact', contactSchema, 'homework');

export default Contact;
