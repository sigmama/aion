import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { LoginComponent } from './login/login.component';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [ThemeModule, RouterModule, NgxAuthRoutingModule, NbAuthModule],
  declarations: [LoginComponent],
})
export class NgxAuthModule {}
