import { createAction, props } from '@ngrx/store';
import { Job, JobInstance } from './job.interfaces';

export const getAvailableJobs = createAction('[Job] Get Available Jobs');

export const getAvailableJobsSuccess = createAction(
  '[Job] Get Available Jobs Success',
  props<{ jobs: Job[] }>()
);

export const getSystems = createAction('[Job] Get Systems');

export const getSystemsSuccess = createAction(
  '[Job] Get Systems Success',
  props<{ systems: string[] }>()
);

export const getCronJobInstances = createAction('[Job] Get Cron Job Instances');

export const getCronJobInstancesSuccess = createAction(
  '[Job] Get Cron Job Instances Success',
  props<{ jobInstances: JobInstance[] }>()
);

export const scheduleCronJobInstance = createAction(
  '[Job] Schedule Cron Job Instance',
  props<{ jobInstance: JobInstance }>()
);

export const scheduleCronJobInstanceSuccess = createAction(
  '[Job] Schedule Cron Job Instance Success'
);

export const scheduleCronJobInstanceFailure = createAction(
  '[Job] Schedule Cron Job Instance Failure',
  props<{ scheduleCronInstanceError: string }>()
);

export const cancelCronJobInstance = createAction(
  '[Job] Cancel Cron Job Instance',
  props<{ id: string }>()
);

export const cancelCronJobInstanceSuccess = createAction(
  '[Job] Cancel Cron Job Instance Success',
  props<{ id: string }>()
);

export const cancelCronJobInstanceFailure = createAction(
  '[Job] Cancel Cron Job Instance Failure'
);

export const scheduleImmediateJobInstance = createAction(
  '[Job] Schedule Immmediate Job Instance',
  props<{ jobInstance: JobInstance }>()
);

export const scheduleImmediateJobInstanceSuccess = createAction(
  '[Job] Schedule Immmediate Job Instance Success'
);

export const scheduleImmediateJobInstanceFailure = createAction(
  '[Job] Schedule Immmediate Job Instance Failure'
);

export const openInstanceModal = createAction(
  '[Job] Open Instance Modal',
  props<{ context: any }>()
);

export const closeInstanceModal = createAction('[Job] Close Instance Modal');

export const openCronPicker = createAction('[Job] Open Cron Picker');

export const closeCronPicker = createAction(
  '[Job] close Cron Picker',
  props<{ cron: string }>()
);

export const initiateJobInstanceModalState = createAction(
  '[Job] Initiate Job Instance Modal State'
);
