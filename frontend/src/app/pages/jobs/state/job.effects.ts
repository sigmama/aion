import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as JobActions from './job.actions';
import { JobService } from '../../../services/jobs.service';
import { JobInstance, Job } from './job.interfaces';
import { NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { CronPickerModalComponent } from '../components/cron-picker-modal/cron-picker-modal.component';
import { JobInstanceModalComponent } from '../components/job-instance-modal/job-instance-modal.component';

@Injectable()
export class JobEffects {
  private jobInstanceModalRef: NbDialogRef<JobInstanceModalComponent>;
  private cronPickerModalRef: NbDialogRef<CronPickerModalComponent>;

  constructor(
    private jobService: JobService,
    private actions$: Actions,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  getSystems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.getSystems),
      mergeMap(() =>
        this.jobService
          .getSystems()
          .pipe(map((systems) => JobActions.getSystemsSuccess({ systems })))
      )
    )
  );

  getAvailableJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.getAvailableJobs),
      mergeMap(() =>
        this.jobService
          .getAvailableJobs()
          .pipe(
            map((jobs: Job[]) => JobActions.getAvailableJobsSuccess({ jobs }))
          )
      )
    )
  );

  getCronJobInstances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.getCronJobInstances),
      mergeMap(() =>
        this.jobService
          .getCronInstances()
          .pipe(
            map((jobInstances: JobInstance[]) =>
              JobActions.getCronJobInstancesSuccess({ jobInstances })
            )
          )
      )
    )
  );

  scheduleCronJobInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.scheduleCronJobInstance),
      mergeMap(({ jobInstance }) =>
        this.jobService.scheduleCronJobInstance(jobInstance).pipe(
          map(() => JobActions.scheduleCronJobInstanceSuccess()),
          catchError((e) =>
            of(
              JobActions.scheduleCronJobInstanceFailure({
                scheduleCronInstanceError: e.error.message,
              })
            )
          )
        )
      )
    )
  );

  // while success, close the modal, show a success toastr, fire an action to refresh the job instance list
  scheduleCronJobInstanceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.scheduleCronJobInstanceSuccess),
      tap(() => this.jobInstanceModalRef.close()),
      tap(() => {
        this.toastrService.success(
          'the cron instance has been scheduled successfully',
          'Success',
          { icon: 'alert-circle-outline' }
        );
      }),
      map(() => JobActions.getCronJobInstances())
    )
  );

  scheduleImmediateJobInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.scheduleImmediateJobInstance),
      mergeMap(({ jobInstance }) =>
        this.jobService.scheduleImmediateJobInstance(jobInstance).pipe(
          map(() => JobActions.scheduleImmediateJobInstanceSuccess()),
          catchError(() => of(JobActions.scheduleImmediateJobInstanceFailure()))
        )
      )
    )
  );

  // fire a toastr to show a successful message
  scheduleImmediateJobInstanceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.scheduleImmediateJobInstanceSuccess),
        tap(() =>
          this.toastrService.success(
            'an instance of the job has been scheduled successfully',
            'Success',
            { icon: 'alert-circle-outline' }
          )
        )
      ),
    { dispatch: false }
  );

  // fire a toastr to show an error message
  scheduleImmediateJobInstanceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.scheduleImmediateJobInstanceFailure),
        tap(() =>
          this.toastrService.danger('job scheduled failed', 'Error', {
            icon: 'alert-circle-outline',
          })
        )
      ),
    { dispatch: false }
  );

  cancelCronJobInstances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.cancelCronJobInstance),
      mergeMap(({ id }) =>
        this.jobService.cancelCronJobInstance(id).pipe(
          map(() => JobActions.cancelCronJobInstanceSuccess({ id })),
          catchError(() => of(JobActions.cancelCronJobInstanceFailure()))
        )
      )
    )
  );

  // fire a toastr to show a successful message
  cancelCronJobInstanceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.cancelCronJobInstanceSuccess),
        tap(() =>
          this.toastrService.success(
            'job instance cancelled successfully',
            'Success',
            { icon: 'alert-circle-outline' }
          )
        )
      ),
    { dispatch: false }
  );

  // fire a toastr to show an error message
  cancelCronJobInstanceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.cancelCronJobInstanceFailure),
        tap(() =>
          this.toastrService.danger('job instance cancelling failed', 'Error', {
            icon: 'alert-circle-outline',
          })
        )
      ),
    { dispatch: false }
  );

  openInstanceModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.openInstanceModal),
        tap(({ context }) => {
          this.jobInstanceModalRef = this.dialogService.open(
            JobInstanceModalComponent,
            {
              closeOnEsc: false,
              closeOnBackdropClick: false,
              context,
            }
          );
        })
      ),
    { dispatch: false }
  );

  closeInstanceModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.closeInstanceModal),
        tap(() => this.jobInstanceModalRef.close())
      ),
    { dispatch: false }
  );

  openCronPicker$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.openCronPicker),
        tap(() => {
          this.cronPickerModalRef = this.dialogService.open(
            CronPickerModalComponent,
            {
              closeOnEsc: false,
              closeOnBackdropClick: false,
            }
          );
        })
      ),
    { dispatch: false }
  );

  closeCronPicker$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobActions.closeCronPicker),
        tap(({ cron }) => this.cronPickerModalRef.close(cron))
      ),
    { dispatch: false }
  );
}
