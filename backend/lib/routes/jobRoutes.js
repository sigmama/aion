const express = require("express");

const jobController = require("../controllers/jobController")();

const routes = () => {
  const jobRouter = express.Router();

  jobRouter.route("/jobs").get(jobController.getAvailableJobs);

  jobRouter
    .route("/job-instances/cron")
    .get(jobController.getCronInstances)
    .post(jobController.scheduleCronJob);

  jobRouter
    .route("/job-instances/cron/:id")
    .delete(jobController.cancelCronJobInstance);

  jobRouter
    .route("/job-instances/immediate")
    .post(jobController.scheduleImmediateJob);

  jobRouter.route("/systems").get(jobController.getSystems);

  return jobRouter;
};

module.exports = routes;
