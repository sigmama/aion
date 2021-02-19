const authRepo = require("../repos/authRepo");
const userRepo = require("../repos/userRepo");
const errHandlers = require("../shared/err-handlers");

const userController = () => {
  const get = (req, res) =>
    userRepo
      .getUsers()
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).json(err));

  const getUserByEid = (req, res) => {
    const { eid } = req.params;
    return userRepo
      .getUserByEid(eid)
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).json(err));
  };

  const post = (req, res) => {
    const { userEid } = req.body;
    return authRepo
      .getLdapAttributes(userEid)
      .then(({ givenname, sn, mail }) =>
        userRepo
          .addUser({
            ...req.body,
            nickName: `${givenname} ${sn}`,
            mail
          })
          .then(() => res.status(200).json({}))
      )
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));
  };

  const put = (req, res) =>
    userRepo
      .updateUser(req.body)
      .then(() => res.status(200).json({}))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));

  const del = (req, res) => {
    const { eid } = req.params;
    return userRepo
      .deleteUser(eid)
      .then(() => res.status(200).json({}))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));
  };

  const getUserRoles = (req, res) =>
    userRepo
      .getUserRoles()
      .then(userRoles => res.status(200).json(userRoles))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));

  return {
    get,
    getUserByEid,
    getUserRoles,
    post,
    put,
    del
  };
};

module.exports = userController;
