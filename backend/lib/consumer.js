/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const util = require("util");
const Agenda = require("agenda");

const readdir = util.promisify(fs.readdir);
const { mdbCfg } = require("./config/dbConfig");

module.exports = async () => {
  const agenda = new Agenda(mdbCfg);
  await new Promise(resolve => agenda.once("ready", resolve));
  await agenda.start();

  // define all jobs before server starts
  const systems = await readdir(`${__dirname}/jobs`);
  systems.forEach(async s => {
    const jobFiles = await readdir(`${__dirname}/jobs/${s}`);
    jobFiles.forEach(f => {
      const jobs = require(`./jobs/${s}/${f}`);
      Object.values(jobs).forEach(j => agenda.define(j.name, j.definition));
    });
  });

  return agenda;
};
