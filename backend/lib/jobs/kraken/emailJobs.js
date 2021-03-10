const axios = require("axios").default;
const { baseUrlCfg } = require("../../config/dbConfig");
const { errLogger, infoLogger } = require("../../shared/logger");

const instance = axios.create({
  baseURL: baseUrlCfg.kraken,
  timeout: 60000
});

module.exports = {
  sendReminderEmailForTimecardEntry: {
    name: "kraken.email.send-reminder-email-for-pending-task-items",
    definition: () =>
      instance
        .post("/pending-task-items-reminder")
        .then(() =>
          infoLogger.info(
            "kraken.email.send-reminder-email-for-pending-task-items|||email sent successfully"
          )
        )
        .catch(e =>
          errLogger.error(
            `kraken.email.send-reminder-email-for-pending-task-items|||${e.message}`
          )
        ),
    desc:
      "send reminding emails to users to take actions against open task items"
  }
};
