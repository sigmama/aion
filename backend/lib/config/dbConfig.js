const cfg = {
  test: {
    mdbCfg: {
      db: {
        address: "mongodb://igs:HON123well@localhost:27017/aion",
        collection: "jobs",
        options: { useUnifiedTopology: true }
      }
    },
    baseUrlCfg: {
      halo: "http://localhost:3006/api/aion-jobs",
      kraken: "http://localhost:3003/api/aion-jobs"
    }
  },
  prod: {
    mdbCfg: {
      db: {
        // admin: sigma:sigmaisabug
        address: "mongodb://igs:HON123well@localhost:27017/aion",
        collection: "jobs",
        options: { useUnifiedTopology: true }
      }
    },
    baseUrlCfg: {
      halo: "http://ch71w0119:3006/api/aion-jobs",
      kraken: "http://spsops.honeywell.com:3003/api/aion-jobs"
    }
  }
};

module.exports = cfg.test;
