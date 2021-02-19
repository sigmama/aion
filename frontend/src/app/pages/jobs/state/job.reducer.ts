import { JobInstance, Job } from './job.interfaces';
import * as FromRoot from '../../../state/app.reducer';
import {
  createFeatureSelector,
  createSelector,
  createReducer,
  on,
} from '@ngrx/store';
import * as JobActions from './job.actions';

export interface State extends FromRoot.State {
  jobs: JobState;
}

export interface JobState {
  systems: string[];
  jobs: Job[];
  jobInstances: JobInstance[];
  cron: string;
  scheduleCronInstanceError: string;
}

const initialState: JobState = {
  systems: [],
  jobs: [],
  jobInstances: [],
  cron: null,
  scheduleCronInstanceError: null,
};

const getJobFeatureState = createFeatureSelector<JobState>('jobs');

export const getSystems = createSelector(
  getJobFeatureState,
  (state) => state.systems
);

export const getAvailableJobs = createSelector(
  getJobFeatureState,
  (state) => state.jobs
);

export const getCronJobInstances = createSelector(
  getJobFeatureState,
  (state) => state.jobInstances
);

export const getScheduleCronInstanceError = createSelector(
  getJobFeatureState,
  (state) => state.scheduleCronInstanceError
);

export const getCron = createSelector(
  getJobFeatureState,
  (state) => state.cron
);

export const reducer = createReducer(
  initialState,
  on(JobActions.getSystemsSuccess, (state, { systems }) => ({
    ...state,
    systems,
  })),
  on(JobActions.getAvailableJobsSuccess, (state, { jobs }) => ({
    ...state,
    jobs,
  })),
  on(JobActions.getCronJobInstancesSuccess, (state, { jobInstances }) => ({
    ...state,
    jobInstances,
  })),
  on(
    JobActions.scheduleCronJobInstanceSuccess ||
      JobActions.initiateJobInstanceModalState,
    (state) => ({
      ...state,
      scheduleCronInstanceError: null,
      cron: null,
    })
  ),
  on(
    JobActions.scheduleCronJobInstanceFailure,
    (state, { scheduleCronInstanceError }) => ({
      ...state,
      scheduleCronInstanceError,
    })
  ),
  on(JobActions.cancelCronJobInstanceSuccess, (state, { id }) => ({
    ...state,
    jobInstances: state.jobInstances.filter((i) => i.id !== id),
  })),
  on(JobActions.closeCronPicker, (state, { cron }) =>
    cron
      ? {
          ...state,
          cron,
        }
      : state
  )
);

// export function reducer(state = initialState, action): JobState {
//   switch (action.type) {
//     case JobActionTypes.GetAvailableJobsSuccess:
//       return { ...state, jobs: action.payload };

//     case JobActionTypes.GetCronJobInstancesSuccess:
//       return { ...state, jobInstances: action.payload };

//     case JobActionTypes.ScheduleCronJobInstanceSuccess:
//     case JobActionTypes.InitiateJobInstanceModalState:
//       return { ...state, scheduleCronInstanceError: null, cron: null };

//     case JobActionTypes.ScheduleCronJobInstanceFailure:
//       return { ...state, scheduleCronInstanceError: action.payload };

//     case JobActionTypes.CancelCronJobInstanceSuccess:
//       return {
//         ...state,
//         jobInstances: state.jobInstances.filter((i) => i.id !== action.payload),
//       };

//     case JobActionTypes.CloseCronPicker:
//       return action.payload ? { ...state, cron: action.payload } : state;

//     default:
//       return state;
//   }
// }
