const joi = require("@hapi/joi");

const cronJobInstanceSchema = joi.object().keys({
  system: joi.string().required(),
  category: joi.string().required(),
  name: joi.string().required(),
  cron: joi.string().required(),
  timezone: joi.string().required()
  // testField: joi.string().required()
});

const immediateJobInstanceSchema = joi.object().keys({
  system: joi.string().required(),
  category: joi.string().required(),
  name: joi.string().required()
});

module.exports = { cronJobInstanceSchema, immediateJobInstanceSchema };
