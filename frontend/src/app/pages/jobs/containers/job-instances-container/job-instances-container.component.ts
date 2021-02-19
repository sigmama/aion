import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import * as FromJob from '../../state/job.reducer';
import * as JobActions from '../../state/job.actions';
import { JobInstance, Job } from '../../state/job.interfaces';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-job-instances-container',
  templateUrl: './job-instances-container.component.html',
})
export class JobInstancesContainerComponent implements OnInit, OnDestroy {
  loggedAccount$: Observable<any>;
  jobs$: Observable<Job[]>;
  instances$: Observable<JobInstance[]>;
  instanceFilter = '';
  rowsOnPage = 15;

  constructor(
    private store: Store<FromJob.State>,
    private authService: NbAuthService
  ) {}

  ngOnInit() {
    this.instances$ = this.store.pipe(select(FromJob.getCronJobInstances));
    this.store.dispatch(JobActions.getCronJobInstances());

    this.jobs$ = this.store.pipe(select(FromJob.getAvailableJobs));
    this.store.dispatch(JobActions.getAvailableJobs());

    this.loggedAccount$ = this.authService
      .getToken()
      .pipe(map((token) => (token.isValid() ? token.getPayload() : null)));
  }

  ngOnDestroy() {}

  cancelCronInstance(id: string) {
    this.store.dispatch(JobActions.cancelCronJobInstance({ id }));
  }

  openInstanceModal(context) {
    this.store.dispatch(JobActions.openInstanceModal({ context }));
  }
}
