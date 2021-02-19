import { NgModule } from '@angular/core';
import { TimePickerComponent } from './cron-time-picker.component';
import { CronGenComponent } from './cron-editor.component';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [ThemeModule],
  exports: [TimePickerComponent, CronGenComponent],
  declarations: [TimePickerComponent, CronGenComponent],
})
export class CronEditorModule {}
