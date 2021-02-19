import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment_tz from 'moment-timezone';
import * as FromJob from '../../state/job.reducer';
import * as JobActions from '../../state/job.actions';
import { Job } from '../../state/job.interfaces';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-job-instance-modal',
  templateUrl: './job-instance-modal.component.html',
  styleUrls: ['./job-instance-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobInstanceModalComponent implements OnInit {
  errScheduleCronInstance$: Observable<string>;
  cron$: Observable<string>;
  jobDesc$: Observable<string>;
  categories$: Observable<any[]>;
  jobNames$: Observable<any[]>;

  loggedAccount: any;
  jobs: Job[] = [];

  timezones = [];
  systems = [];

  f: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.store.dispatch(JobActions.initiateJobInstanceModalState());
    this.timezones = moment_tz.tz.names();
  }

  ngOnInit() {
    this.errScheduleCronInstance$ = this.store.pipe(
      select(FromJob.getScheduleCronInstanceError)
    );

    this.cron$ = this.store.pipe(
      select(FromJob.getCron),
      tap((cron) => this.f.get('cron').setValue(cron))
    );

    this.systems = Array.from(
      new Set(this.jobs.map((j) => j.system))
    ).filter((s) =>
      this.loggedAccount.role === 'superadmin'
        ? true
        : this.loggedAccount.systems.includes(s)
    );

    this.f = this.fb.group({
      system: [null, [Validators.required]],
      category: [{ value: null, disabled: true }, [Validators.required]],
      name: [{ value: null, disabled: true }, [Validators.required]],
      cron: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
    });

    this.categories$ = this.f.get('system').valueChanges.pipe(
      tap(() => {
        this.f.get('category').setValue(null);
        this.f.get('category').markAsUntouched();
        this.f.get('category').enable();
      }),
      map((s) =>
        Array.from(
          new Set(
            this.jobs.filter((j) => j.system === s).map((j) => j.category)
          )
        )
      ),
      startWith([])
    );

    this.jobNames$ = this.f.get('category').valueChanges.pipe(
      tap((c) => {
        this.f.get('name').setValue(null);
        this.f.get('name').markAsUntouched();
        if (c) {
          this.f.get('name').enable();
        } else {
          this.f.get('name').disable();
        }
      }),
      map((c) =>
        this.jobs
          .filter(
            (j) => j.system === this.f.get('system').value && j.category === c
          )
          .map((j) => j.name)
      ),
      startWith([])
    );

    this.jobDesc$ = this.f
      .get('name')
      .valueChanges.pipe(
        map((name) => (name ? this.jobs.find((j) => j.name === name).desc : ''))
      );

    // this.cron$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((cron) => this.f.get('cron').setValue(cron));
  }

  showCronPicker() {
    this.store.dispatch(JobActions.openCronPicker());
  }

  cancel() {
    this.store.dispatch(JobActions.closeInstanceModal());
  }

  onSubmit() {
    if (this.f.invalid) {
      return;
    }

    if (window.confirm('Confirm to schedule this job?')) {
      this.store.dispatch(
        JobActions.scheduleCronJobInstance({
          jobInstance: this.f.getRawValue(),
        })
      );
    }
  }
}
