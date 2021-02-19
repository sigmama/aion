/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const util = require("util");
const ObjectID = require("mongoose").Types.ObjectId;

const readdirAsync = util.promisify(fs.readdir);
const errHandlers = require("../shared/err-handlers");

const jobRepo = {
  getAvailableJobs: async () => {
    // for PM2 deployment
    // const systems = await readdirAsync(`./aion/lib/jobs`);
    const systems = await readdirAsync(`./lib/jobs`);
    const dataPromises = systems.map(async s => {
      // for PM2 deployment
      // const jobFiles = await readdirAsync(`./aion/lib/jobs/${s}`);
      const jobFiles = await readdirAsync(`./lib/jobs/${s}`);
      // console.log(cronInstances);
      const jobCategories = jobFiles.map(f => {
        const jobs = require(`../jobs/${s}/${f}`);
        return {
          category: f.replace("Jobs.js", ""),
          jobs: Object.values(jobs).map(({ name, desc }) => ({ name, desc }))
        };
      });

      return {
        sysName: s,
        jobCategories
      };
    });

    const data = (await Promise.all(dataPromises)).reduce(
      (r1, sys) => [
        ...r1,
        ...sys.jobCategories.reduce(
          (r2, jc) => [
            ...r2,
            ...jc.jobs.map(j => ({
              system: sys.sysName,
              category: jc.category,
              name: j.name,
              desc: j.desc,
              isFirstSystem: j === sys.jobCategories[0].jobs[0],
              isFirstJobCategory: j === jc.jobs[0]
            }))
          ],
          []
        )
      ],
      []
    );

    return data;
  },

  getCronInstances: async agenda => {
    const instances = (
      await agenda.jobs({ repeatInterval: { $exists: true } })
    ).map(j => {
      // console.log(j);
      return {
        id: j.attrs._id,
        system: j.attrs.data.system,
        category: j.attrs.data.category,
        name: j.attrs.name,
        lastFinishedAt: j.attrs.lastFinishedAt,
        lastRunAt: j.attrs.lastRunAt,
        nextRunAt: j.attrs.nextRunAt,
        cron: j.attrs.repeatInterval,
        timeZone: j.attrs.repeatTimezone
      };
    });

    // console.log(instances);
    return instances;
  },

  scheduleCronJob: async (agenda, job) => {
    const existingJobsWithProvidedNameAndCron = await agenda.jobs({
      name: job.name,
      repeatInterval: job.cron
    });

    if (existingJobsWithProvidedNameAndCron.length > 0) {
      errHandlers.throwError(
        400,
        "duplicated instance detected, please change job/cron"
      )(new Error());
    }

    await agenda
      .create(job.name, {
        system: job.system,
        category: job.category,
        cron: job.cron
      })
      .repeatEvery(job.cron, {
        timezone: job.timezone
      })
      .save();
  },

  cancelCronJobInstance: async (agenda, id) => {
    await agenda.cancel({ _id: ObjectID(id) });
  },

  scheduleImmediateJob: async (agenda, job) => {
    await agenda.now(job.name, {
      system: job.system,
      category: job.category
    });
  },

  getSystems: async () => {
    const systems = await readdirAsync(`./lib/jobs`);
    return systems;
  }
};

module.exports = jobRepo;
