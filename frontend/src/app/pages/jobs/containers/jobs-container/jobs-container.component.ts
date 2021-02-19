import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { Store, select } from '@ngrx/store';
import * as FromJob from '../../state/job.reducer';
import * as JobActions from '../../state/job.actions';
import { Job } from '../../state/job.interfaces';
import { JobInstance } from '../../state/job.interfaces';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-jobs-container',
  templateUrl: './jobs-container.component.html',
})
export class JobsContainerComponent implements OnInit {
  jobs$: Observable<Job[]>;
  loggedAccount$: Observable<any>;

  constructor(
    private store: Store<FromJob.State>,
    private authService: NbAuthService
  ) {}

  ngOnInit() {
    this.jobs$ = this.store.pipe(select(FromJob.getAvailableJobs));
    this.store.dispatch(JobActions.getAvailableJobs());

    this.loggedAccount$ = this.authService
      .getToken()
      .pipe(map((token) => (token.isValid() ? token.getPayload() : null)));
  }

  scheduleImmediateJobInstance(jobInstance: JobInstance) {
    this.store.dispatch(
      JobActions.scheduleImmediateJobInstance({ jobInstance })
    );
  }
}
