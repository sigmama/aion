import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as JobActions from '../../state/job.actions';
import { CronOptions } from '../../../../ngx-cron-editor/CronOptions';

@Component({
  selector: 'ngx-cron-picker-modal',
  templateUrl: './cron-picker-modal.component.html',
  styleUrls: ['./cron-picker-modal.component.scss'],
})
export class CronPickerModalComponent implements OnInit {
  public cronExpression = '0 0 1/1 * *';
  public isCronDisabled = false;
  public cronOptions: CronOptions = {
    defaultTime: '00:00:00',

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSpecificWeekDayTab: false,
    hideSpecificMonthWeekTab: false,

    use24HourTime: true,
    hideSeconds: false,

    cronFlavor: 'standard',
  };

  public isValid = true;

  cronForm: FormControl;
  constructor(private store: Store) {}

  ngOnInit() {
    this.cronForm = new FormControl(this.cronExpression);
  }

  cancel() {
    this.store.dispatch(JobActions.closeCronPicker({ cron: null }));
  }

  onSubmit() {
    this.store.dispatch(
      JobActions.closeCronPicker({ cron: this.cronForm.value })
    );
  }

  validateCron(e) {
    this.isValid = e;
  }
}
