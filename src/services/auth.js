import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { Session } from '../db/models/Session.js';
import { randomBytes } from 'node:crypto';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/index.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';

const template_dir = path.join(process.cwd(), 'src', 'templates');

export const registerUser = async (userData) => {
  const { email, password } = userData;
  const userCheck = await User.findOne({ email });
  if (userCheck) {
    throw createHttpError(409, 'Email in use');
  }

  const sifrelenmisSifre = await bcrypt.hash(password, 10);
  userData.password = sifrelenmisSifre;
  const user = await User.create(userData);
  return user;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email');
  }
  const passwordControl = await bcrypt.compare(password, user.password);
  if (!passwordControl) {
    throw createHttpError(401, 'Invalid password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_TIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_TIME);

  const sessionData = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return sessionData;
};

export const refreshUser = async (refreshToken, sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw createHttpError(404, 'session not found');
  }

  if (session.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(400, 'refreshToken has expired');
  }
  const accessTokenNew = randomBytes(30).toString('base64');
  const refreshTokenNew = randomBytes(30).toString('base64');

  const accessTokenValidUntilNew = new Date(Date.now() + ACCESS_TOKEN_TIME);
  const refreshTokenValidUntilNew = new Date(Date.now() + REFRESH_TOKEN_TIME);

  const sessionData = await Session.create({
    userId: session.userId,
    accessToken: accessTokenNew,
    refreshToken: refreshTokenNew,
    accessTokenValidUntil: accessTokenValidUntilNew,
    refreshTokenValidUntil: refreshTokenValidUntilNew,
  });
  await Session.findByIdAndDelete(sessionId);
  return sessionData;
};

export const logoutUser = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) return;
  await Session.findByIdAndDelete(sessionId);
};

export const requestResetMail = async (email) => {
  const user = await User.findOne({ email });
  // kullanıcı kontrolü
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // token olustur

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    // imza

    process.env.JWT_SECRET,

    // options
    {
      expiresIn: '5m',
    }
  );

  const templatePath = path.join(template_dir, 'reset-password.html');
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent.toString());

  const htmlMailIcerik = template({
    name: user.name,
    url: `${process.env.APP_DOMAIN}/reset-pwd?token=${resetToken}`,
  });

  // mail gönder

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password Reset Email',
      html: htmlMailIcerik,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }
  return true;
};

export const resetPassword = async (token, password) => {
  // token geçerlimi

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  // şifre güncelle

  const userId = decodedToken.sub;
  const userMail = decodedToken.email;

  const user = await User.findOne({ _id: userId, email: userMail });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const sifrelenmisSifre = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(userId, {
    password: sifrelenmisSifre,
  });
  await Session.deleteMany({ userId: user._id });

  return true;
};
