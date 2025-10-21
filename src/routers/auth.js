import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
} from '../controllers/auth.js';

const auth = Router();

auth.post('/register', registerUserController);

auth.post('/login', loginUserController);

auth.post('/refresh', refreshUserController);

auth.post('/logout', logoutUserController);

export default auth;
