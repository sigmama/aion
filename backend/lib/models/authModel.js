const joi = require("@hapi/joi");

const credentialSchema = joi.object().keys({
  email: joi
    .string()
    .max(40)
    .required(),
  password: joi
    .string()
    .max(20)
    .required()
  // rememberMe: joi.boolean()
});

const refreshTokenSchema = joi.object().keys({
  token: joi.string().required()
});

module.exports = {
  credentialSchema,
  refreshTokenSchema
};
