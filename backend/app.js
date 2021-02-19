const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { mdbCfg } = require("./lib/config/dbConfig");
const consumer = require("./lib/consumer");
const { errLogger } = require("./lib/shared/logger");
const userRepo = require("./lib/repos/userRepo");

const app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

const authRouter = require("./lib/routes/authRoutes")();
const userRouter = require("./lib/routes/userRoutes")();
const jobRouter = require("./lib/routes/jobRoutes")();

(async () => {
  try {
    // intiate mongoose
    await mongoose.connect(mdbCfg.db.address, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // seed aion users and roles if not existing
    // take additinal care for horizontal expansion, eg using pm2 cluster mode
    await userRepo.seedUserAndRoles();

    app.use("/api", authRouter);
    app.use("/api", userRouter);

    // start agenda
    const agenda = await consumer();
    // attach agenda instance to request
    app.use((req, res, next) => {
      req.agendaInstance = agenda;
      return next();
    });

    app.use("/api", jobRouter);
    app.listen(4000);
  } catch (e) {
    errLogger.error(`aion.express.start|||${e.message}`);
    process.exit(-1);
  }
})();
