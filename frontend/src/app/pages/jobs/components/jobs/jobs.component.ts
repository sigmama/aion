import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job, JobInstance } from '../../state/job.interfaces';

@Component({
  selector: 'ngx-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent {
  @Input() loggedAccount: any;
  @Input() jobs: Job[];
  @Output() scheduleImmediateJobInstance = new EventEmitter<JobInstance>();
  jobFilter = '';

  getSystemCount(job) {
    return this.jobs.filter((j) => j.system === job.system).length;
  }

  getJobCategoryCount(job) {
    return this.jobs.filter(
      (j) => j.system === job.system && j.category === job.category
    ).length;
  }

  runJobNow({ system, category, name }) {
    if (window.confirm('Confirm to run this job immediately?')) {
      this.scheduleImmediateJobInstance.emit({ system, category, name });
    }
  }

  disableButton(system) {
    if (!this.loggedAccount) {
      return true;
    }

    return !(
      this.loggedAccount.role === 'superadmin' ||
      (this.loggedAccount.role !== 'superadmin' &&
        this.loggedAccount.systems.includes(system))
    );
  }
}
