const express = require("express");

const authController = require("../controllers/authController")();

const routes = () => {
  const authRouter = express.Router();
  authRouter.route("/usersignin").post(authController.userSignIn);

  return authRouter;
};

module.exports = routes;
