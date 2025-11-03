import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
  requestResetMailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateAuthBody } from '../middlewares/validateBody.js';
import { emailSchema, resetPasswordSchema } from '../validation/authSchemas.js';

const auth = Router();

auth.post('/register', registerUserController);

auth.post('/login', loginUserController);

auth.post('/refresh', refreshUserController);

auth.post('/logout', logoutUserController);

auth.post(
  '/send-reset-email',
  validateAuthBody(emailSchema),
  requestResetMailController
);

auth.post(
  '/reset-pwd',
  validateAuthBody(resetPasswordSchema),
  resetPasswordController
);

export default auth;
