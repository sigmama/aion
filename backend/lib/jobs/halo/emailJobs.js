const axios = require("axios").default;
const { baseUrlCfg } = require("../../config/dbConfig");
const { errLogger, infoLogger } = require("../../shared/logger");

const instance = axios.create({
  baseURL: baseUrlCfg.halo,
  timeout: 60000
});

module.exports = {
  sendReminderEmailForTimecardEntry: {
    name: "halo.email.send-reminder-email-for-timecard-submittion",
    definition: () =>
      instance
        .post("/timecard-submittion-reminder")
        .then(() =>
          infoLogger.info(
            "halo.email.send-reminder-email-for-timecard-submittion|||email sent successfully"
          )
        )
        .catch(e =>
          errLogger.error(
            `halo.email.send-reminder-email-for-timecard-submittion|||${e.message}`
          )
        ),
    desc: "send reminding emails to users to submit timecards"
  },

  sendReminderEmailForTimecardApproval: {
    name: "halo.email.send-reminder-email-for-timecard-approval",
    definition: () =>
      instance
        .post("/timecard-approval-reminder")
        .then(() =>
          infoLogger.info(
            "halo.email.send-reminder-email-for-timecard-approval|||email sent successfully"
          )
        )
        .catch(e =>
          errLogger.error(
            `halo.email.send-reminder-email-for-timecard-approval|||${e.message}`
          )
        ),
    desc: "send reminding emails to users to approve timecards"
  }
};
