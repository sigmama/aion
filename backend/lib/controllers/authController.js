const authModel = require("../models/authModel");
const authRepo = require("../repos/authRepo");
const errHandlers = require("../shared/err-handlers");

const authController = () => {
  const userSignIn = (req, res) =>
    authModel.credentialSchema
      .validateAsync(req.body)
      .then(credential =>
        authRepo
          .authenticate(credential)
          .then(token => res.status(200).json({ token }))
          .catch(e =>
            errHandlers.sendError(res, 500, "internal server error")(e)
          )
      )
      .catch(validationErr =>
        errHandlers.sendError(
          res,
          400,
          validationErr.details[0].message
        )(new Error())
      );

  const refreshToken = (req, res) =>
    authModel.refreshTokenSchema
      .validateAsync(req.body)
      .then(val =>
        authRepo
          .getRefreshToken(val)
          .then(token => res.status(200).json({ token }))
          .catch(e =>
            errHandlers.sendError(res, 500, "internal server error")(e)
          )
      )
      .catch(validationErr =>
        errHandlers.sendError(
          res,
          400,
          validationErr.details[0].message
        )(new Error())
      );

  return {
    userSignIn,
    refreshToken
  };
};

module.exports = authController;
