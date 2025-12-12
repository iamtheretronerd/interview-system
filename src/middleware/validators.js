const Joi = require("joi");

const schemas = {
  sendMessage: Joi.object({
    sessionId: Joi.string().required().messages({
      "string.empty": "Session ID is required",
      "any.required": "Session ID is required",
    }),
    message: Joi.string().min(1).max(2000).required().messages({
      "string.empty": "Message cannot be empty",
      "string.max": "Message cannot exceed 2000 characters",
      "any.required": "Message is required",
    }),
  }),

  endInterview: Joi.object({
    sessionId: Joi.string().required().messages({
      "string.empty": "Session ID is required",
      "any.required": "Session ID is required",
    }),
  }),

  mongoId: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid ID format",
      "string.length": "Invalid ID format",
      "any.required": "ID is required",
    }),
  }),
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return next(new Error(`Schema '${schemaName}' not found`));
    }

    const dataToValidate = schemaName === "mongoId" ? req.params : req.body;

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    if (schemaName === "mongoId") {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
};

module.exports = { validate, schemas };
