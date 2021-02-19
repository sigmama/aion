const errHandlers = require("../shared/err-handlers");
const jobModel = require("../models/jobModel");
const jobRepo = require("../repos/jobRepo");

const jobController = () => {
  const getAvailableJobs = (req, res) =>
    jobRepo
      .getAvailableJobs()
      .then(data => res.status(200).json(data))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));

  const getCronInstances = (req, res) => {
    const { agendaInstance: agenda } = req;
    jobRepo
      .getCronInstances(agenda)
      .then(instances => res.status(200).json(instances))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));
  };

  const scheduleCronJob = (req, res) =>
    jobModel.cronJobInstanceSchema
      .validateAsync(req.body)
      .then(job => {
        const { agendaInstance: agenda } = req;
        jobRepo
          .scheduleCronJob(agenda, job)
          .then(() => res.status(200).json({}))
          .catch(e =>
            errHandlers.sendError(res, 500, "internal server error")(e)
          );
      })
      .catch(validationErr => {
        errHandlers.sendError(
          res,
          400,
          validationErr.details[0].message
        )(new Error());
      });

  const cancelCronJobInstance = (req, res) => {
    const { agendaInstance: agenda } = req;
    const { id } = req.params;

    jobRepo
      .cancelCronJobInstance(agenda, id)
      .then(() => res.status(200).json({}))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));
  };

  const scheduleImmediateJob = (req, res) =>
    jobModel.immediateJobInstanceSchema
      .validateAsync(req.body)
      .then(job => {
        const { agendaInstance: agenda } = req;
        jobRepo
          .scheduleImmediateJob(agenda, job)
          .then(() => res.status(200).json({}))
          .catch(e =>
            errHandlers.sendError(res, 500, "internal server error")(e)
          );
      })
      .catch(validationErr => {
        errHandlers.sendError(
          res,
          400,
          validationErr.details[0].message
        )(new Error());
      });

  const getSystems = (req, res) =>
    jobRepo
      .getSystems()
      .then(systems => res.status(200).json(systems))
      .catch(e => errHandlers.sendError(res, 500, "internal server error")(e));

  return {
    getSystems,
    getAvailableJobs,
    getCronInstances,
    scheduleCronJob,
    cancelCronJobInstance,
    scheduleImmediateJob
  };
};

module.exports = jobController;
