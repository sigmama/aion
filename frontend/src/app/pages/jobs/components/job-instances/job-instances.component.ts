import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JobInstance, Job } from '../../state/job.interfaces';

@Component({
  selector: 'ngx-job-instances',
  templateUrl: './job-instances.component.html',
  styleUrls: ['./job-instances.component.scss'],
})
export class JobInstancesComponent {
  @Input() loggedAccount: any;
  @Input() jobs: Job[];
  @Input() instances: JobInstance[];
  @Output() cancelCronInstance = new EventEmitter<string>();
  @Output() openInstanceModal = new EventEmitter<any>();
  instanceFilter = '';
  rowsOnPage = 15;

  showInstanceModal() {
    this.openInstanceModal.emit({
      loggedAccount: this.loggedAccount,
      jobs: this.jobs,
    });
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

  cancelInstance(id) {
    if (confirm('Are you sure to cancel the job instance?')) {
      this.cancelCronInstance.emit(id);
    }
  }
}
