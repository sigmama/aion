import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as FromUser from '../state/user.reducer';
import * as UserActions from '../state/user.actions';

import * as FromJob from '../../jobs/state/job.reducer';
import * as JobActions from '../../jobs/state/job.actions';

@Component({
  selector: 'ngx-users-container',
  templateUrl: './users-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersContainerComponent implements OnInit {
  loggedAccount$: Observable<any>;
  allRoles$: Observable<any[]>;
  allSystems$: Observable<any[]>;
  users$: Observable<any[]>;

  constructor(private store$: Store, private authService: NbAuthService) {}

  ngOnInit() {
    this.users$ = this.store$.pipe(select(FromUser.getUsers));
    this.allRoles$ = this.store$.pipe(select(FromUser.getUserRoles));
    this.allSystems$ = this.store$.pipe(select(FromJob.getSystems));
    this.loggedAccount$ = this.authService
      .getToken()
      .pipe(map((token) => (token.isValid() ? token.getPayload() : null)));

    this.store$.dispatch(UserActions.getUsers());
    this.store$.dispatch(UserActions.getUserRoles());
    this.store$.dispatch(JobActions.getSystems());
  }

  openUserModal(context) {
    this.store$.dispatch(UserActions.openUserModal({ context }));
  }

  deleteUser(userEid) {
    this.store$.dispatch(UserActions.deleteUser({ userEid }));
  }
}
