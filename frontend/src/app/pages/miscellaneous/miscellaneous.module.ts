import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  imports: [ThemeModule, MiscellaneousRoutingModule],
  declarations: [MiscellaneousComponent, NotFoundComponent, ForbiddenComponent],
})
export class MiscellaneousModule {}
