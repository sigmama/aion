import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    JobsModule,
    UsersModule,
    MiscellaneousModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
