export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        details: error.details.map((err) => err.message),
        message: 'Validation error',
      });
    }
    next();
  };
};

export const validateAuthBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Body validation error',
        details: error.details.map((err) => err.message),
      });
    }

    next();
  };
};
