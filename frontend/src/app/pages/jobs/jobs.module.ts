import { NgModule, OnInit } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';
import { JobInstanceModalComponent } from './components/job-instance-modal/job-instance-modal.component';
import { CronPickerModalComponent } from './components/cron-picker-modal/cron-picker-modal.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/job.reducer';
import { EffectsModule } from '@ngrx/effects';
import { JobEffects } from './state/job.effects';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobsContainerComponent } from './containers/jobs-container/jobs-container.component';
import { JobInstancesComponent } from './components/job-instances/job-instances.component';
import { JobInstancesContainerComponent } from './containers/job-instances-container/job-instances-container.component';
import { CronEditorModule } from '../../ngx-cron-editor/cron-editor.module';

@NgModule({
  declarations: [
    JobsContainerComponent,
    JobsComponent,
    JobInstancesContainerComponent,
    JobInstancesComponent,
    JobInstanceModalComponent,
    CronPickerModalComponent,
  ],
  imports: [
    CronEditorModule,
    ThemeModule,
    NbDialogModule.forChild(),
    StoreModule.forFeature('jobs', reducer),
    EffectsModule.forFeature([JobEffects]),
  ],
  entryComponents: [JobInstanceModalComponent, CronPickerModalComponent],
})
export class JobsModule implements OnInit {
  ngOnInit() {}
}
