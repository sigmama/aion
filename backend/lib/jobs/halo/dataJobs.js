const axios = require("axios").default;
const { baseUrlCfg } = require("../../config/dbConfig");
const { errLogger, infoLogger } = require("../../shared/logger");

const instance = axios.create({
  baseURL: baseUrlCfg.halo,
  timeout: 60000
});

module.exports = {
  refreshTimecardEntries: {
    name: "halo.data.process-latest-oracle-report",
    definition: () =>
      instance
        .post("/latest-oracle-report-processing")
        .then(() =>
          infoLogger.info(
            "halo.data.process-latest-oracle-report|||data processed successfully"
          )
        )
        .catch(e =>
          errLogger.error(
            `halo.data.process-latest-oracle-report|||${e.message}`
          )
        ),
    desc: "process latest oracle report"
  }
};
