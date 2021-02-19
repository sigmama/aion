const express = require("express");

const userController = require("../controllers/userController")();

const routes = () => {
  const userRouter = express.Router();

  userRouter
    .route("/users")
    .get(userController.get)
    .post(userController.post)
    .put(userController.put);

  userRouter
    .route("/users/:eid")
    .get(userController.getUserByEid)
    .delete(userController.del);

  userRouter.route("/user-roles").get(userController.getUserRoles);

  return userRouter;
};

module.exports = routes;
