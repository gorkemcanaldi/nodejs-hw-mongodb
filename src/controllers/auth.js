import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  requestResetMail,
  resetPassword,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;

  const data = await registerUser(userData);
  res.status(201).send({
    message: 'Successfully registered a user!',
    status: 201,
    data,
  });
};

export const loginUserController = async (req, res) => {
  const userData = req.body;
  const session = await loginUser(userData);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'Successfully logged in an user!',
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await refreshUser(refreshToken, sessionId);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'Successfully refreshed a session!',
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  await logoutUser(sessionId);

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const requestResetMailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    await requestResetMail(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
