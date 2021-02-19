import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as UserActions from '../../state/user.actions';
import * as FromUser from '../../state/user.reducer';

@Component({
  selector: 'ngx-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent implements OnInit {
  errMsgAddOrUpdateUser$: Observable<string>;
  role$: Observable<any>;
  mode: string;
  loggedAccount: any;
  selectedUser: any;
  allRoles = [];
  allSystems = [];
  teams = [];
  f: FormGroup;

  constructor(private store$: Store, private fb: FormBuilder) {}

  ngOnInit() {
    this.f = this.fb.group({
      userEid: [
        { value: this.selectedUser.userEid, disabled: this.mode === 'edit' },
        [Validators.required, Validators.pattern('([a-zA-Z]{1})([0-9]{6})')],
      ],
      role: [this.selectedUser.role, Validators.required],
      systems: [
        this.selectedUser.systems,
        this.selectedUser.role !== 'superadmin' ? [Validators.required] : [],
      ],
      isActive: this.selectedUser.isActive,
    });

    this.role$ = this.f.get('role').valueChanges.pipe(
      tap((v) => {
        if (v === 'superadmin') {
          this.f.get('systems').clearValidators();
          this.f.get('systems').setValue([]);
        } else {
          this.f.get('systems').setValidators([Validators.required]);
          this.f.get('systems').setValue(this.selectedUser.systems);
        }
      })
    );

    this.errMsgAddOrUpdateUser$ = merge(
      this.store$.pipe(select(FromUser.getErrMsgAddOrUpdateUser)),
      this.f.valueChanges.pipe(map(() => ''))
    );
  }

  cancel() {
    this.store$.dispatch(UserActions.closeUserModal());
  }

  onSubmit() {
    if (this.f.invalid) {
      return;
    }

    if (!window.confirm('confirm to add/update user?')) {
      return;
    }

    const submittedData = this.f.getRawValue();

    if (this.mode === 'edit') {
      if (submittedData.isActive === this.selectedUser.isActive) {
        delete submittedData.isActive;
      }
      if (submittedData.role === this.selectedUser.role) {
        delete submittedData.role;
      }
    }

    this.store$.dispatch(
      UserActions.addOrUpdateUser({
        user: submittedData,
        isAdd: this.mode === 'add',
      })
    );
  }
}
