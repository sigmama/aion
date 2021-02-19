/* eslint-disable no-underscore-dangle */
const ldap = require("ldapjs");
const jwt = require("jwt-simple");
const moment = require("moment");

const ldapcfg = require("../config/ldapConfig");
const jwtcfg = require("../config/jwtConfig");
const errHandlers = require("../shared/err-handlers");
const UserModel = require("../models/userModel");

const attributes = ["givenname", "sn", "mail"];

const authRepo = {
  authenticate: async ({ email: userEid, password }) => {
    const user = await UserModel.findOne({ userEid }).exec();

    if (!user) {
      errHandlers.throwError(404, "user not found")(new Error());
    }

    await authRepo.authenticateViaLdap(userEid, password);

    const payload = {
      // eslint-disable-next-line no-underscore-dangle
      secret: user._id,
      nick: user.nickName,
      role: user.role,
      systems: user.systems,
      userEid: user.userEid,
      nbf: moment().unix(),
      exp: moment()
        .add(jwtcfg.expDurationInHours, "hours")
        .unix()
    };
    return jwt.encode(payload, jwtcfg.secret);
  },

  getRefreshToken: async val => {
    let payload;
    try {
      payload = jwt.decode(val.token, jwtcfg.secret, true);
    } catch (e) {
      errHandlers.throwError(400, "invalid token")(new Error());
    }

    if (!payload._id || !payload.userName || !moment(payload.exp).isValid()) {
      errHandlers.throwError(400, "invalid token")(new Error());
    }

    const expDuration = moment().diff(moment.unix(payload.exp), "minutes");
    // token expires after 1 hour, does not allow to refresh
    if (expDuration > 60) {
      errHandlers.throwError(
        403,
        "not able to refresh, login required"
      )(new Error());
    }

    const user = await UserModel.findById(payload._id).exec();

    if (payload.userName === user.userEid) {
      errHandlers.throwError(403, "invalid user, login required")(new Error());
    }

    const newPayload = {
      // eslint-disable-next-line no-underscore-dangle
      secret: user._id,
      nick: user.nickName,
      role: user.role,
      systems: user.systems,
      userEid: user.userEid,
      nbf: moment().unix(),
      exp: moment()
        .add(jwtcfg.expDurationInHours, "hours")
        .unix()
    };
    return jwt.encode(newPayload, jwtcfg.secret);
  },

  getLdapAttributes: userName =>
    new Promise((resolve, reject) => {
      const ldapClient = ldap.createClient({ url: ldapcfg.url });
      ldapClient.on("error", () => {
        const connectionError = new Error();
        connectionError.code = 500;
        connectionError.errorMessage = "ldap connection error encounterred";
        return reject(connectionError);
      });

      ldapClient.on("connect", () => {
        ldapClient.bind(ldapcfg.userDN, ldapcfg.userPwd, bError => {
          if (bError) {
            const bindingError = new Error();
            bindingError.code = 401;
            bindingError.errorMessage = "ldap error encounterred";
            reject(bindingError);
            return;
          }

          // Get user account from Honeywell LDAP libararies with user EID
          ldapClient.search(
            "o=Honeywell",
            { filter: `(uid=${userName})`, scope: "sub", attributes },
            (sErr, searchRes) => {
              if (sErr) {
                const searchError = new Error();
                searchError.code = 401;
                searchError.errorMessage = "ldap search error encounterred";
                reject(searchError);
                return;
              }

              const searchList = [];
              searchRes.on("searchEntry", entry => {
                searchList.push(entry);
              });

              searchRes.on("end", () => {
                // No account found
                if (searchList.length === 0) {
                  const findingError = new Error();
                  findingError.code = 401;
                  findingError.errorMessage = "invalid user eid";
                  reject(findingError);
                  return;
                }

                const rawAttrs = { ...searchList[0].raw };
                // transfer buffer to string
                attributes.forEach(k => {
                  rawAttrs[k] = Buffer.from(rawAttrs[k], "binary").toString();
                });

                resolve(rawAttrs);
              });
            }
          );
        });
      });
    }),

  authenticateViaLdap: (userName, password) =>
    new Promise((resolve, reject) => {
      const ldapClient = ldap.createClient({ url: ldapcfg.url });
      ldapClient.on("error", () => {
        const connectionError = new Error();
        connectionError.code = 500;
        connectionError.errorMessage = "ldap connection error encounterred";
        return reject(connectionError);
      });

      ldapClient.on("connect", () => {
        ldapClient.bind(ldapcfg.userDN, ldapcfg.userPwd, bErr => {
          if (bErr) {
            const bindingError = new Error();
            bindingError.code = 401;
            bindingError.errorMessage = "ldap binding error encounterred";
            reject(bindingError);
            return;
          }

          // Get user account from Honeywell LDAP libararies with user EID
          ldapClient.search(
            "o=Honeywell",
            { filter: `(uid=${userName})`, scope: "sub", attributes },
            (sError, searchRes) => {
              if (sError) {
                const searchError = new Error();
                searchError.code = 401;
                searchError.errorMessage = "ldap search error encounterred";
                reject(searchError);
                return;
              }

              const searchList = [];
              searchRes.on("searchEntry", entry => {
                searchList.push(entry);
              });

              searchRes.on("end", () => {
                // No account found
                if (searchList.length === 0) {
                  const findingError = new Error();
                  findingError.code = 401;
                  findingError.errorMessage = "invalid user eid or password";
                  reject(findingError);
                  return;
                }

                const dn = searchList[0].objectName;

                // Check password for users account using bind
                ldapClient.bind(dn, password, bErr2 => {
                  if (bErr2) {
                    const bindingError2 = new Error();
                    bindingError2.code = 401;
                    bindingError2.errorMessage = "invalid user eid or password";
                    reject(bindingError2);
                    return;
                  }
                  resolve();
                });

                // Check password for users account using compare, not allowed in new environment
                // ldapClient.compare(
                //   dn,
                //   "userpassword",
                //   password,
                //   (compareError, matched) => {
                //     if (compareError || !matched) {
                //       // console.log(compareError);
                //       const authError = new Error();
                //       authError.code = 401;
                //       authError.errorMessage = "invalid user eid or password";
                //       reject(authError);
                //       return;
                //     }

                //     resolve();
                //   }
                // );
              });
            }
          );
        });
      });
    })
};

module.exports = authRepo;
