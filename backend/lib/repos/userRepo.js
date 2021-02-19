const UserModel = require("../models/userModel");
const UserRoleModel = require("../models/userRoleModel");

const userRepo = {
  getUsers: () => UserModel.find().exec(),

  getUserByEid: eid => UserModel.findOne({ userEid: eid }).exec(),

  addUser: user => new UserModel(user).save(),

  updateUser: ({ userEid, ...user }) =>
    UserModel.updateOne({ userEid }, user).exec(),

  deleteUser: eid => UserModel.deleteOne({ userEid: eid }).exec(),

  getUserRoles: () => UserRoleModel.find().exec(),

  seedUserAndRoles: async () => {
    const [users, userRoles] = await Promise.all([
      UserModel.find().exec(),
      UserRoleModel.find().exec()
    ]);

    if (!users.length) {
      await new UserModel({
        userEid: "E438138",
        nickName: "Sigma Ma",
        mail: "Sigma.Ma@Honeywell.com",
        role: "superadmin",
        systems: [],
        isActive: true
      }).save();
    }

    if (!userRoles.length) {
      await UserRoleModel.insertMany([
        { role: "superadmin" },
        { role: "systemadmin" }
      ]);
    }
  }
};

module.exports = userRepo;
