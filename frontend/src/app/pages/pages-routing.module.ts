import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../services/auth-guard.service';
import { AUTHCONFIG } from '../auth/auth-cfg';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ForbiddenComponent } from './miscellaneous/forbidden/forbidden.component';
import { JobsContainerComponent } from './jobs/containers/jobs-container/jobs-container.component';
import { JobInstancesContainerComponent } from './jobs/containers/job-instances-container/job-instances-container.component';
import { UsersContainerComponent } from './users/containers/users-container.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'jobs',
        component: JobsContainerComponent,
      },
      {
        path: 'job-instances',
        component: JobInstancesContainerComponent,
      },
      {
        path: 'users',
        component: UsersContainerComponent,
        canActivate: [AuthGuard],
        data: { roles: AUTHCONFIG.users },
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent,
      },
      {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
