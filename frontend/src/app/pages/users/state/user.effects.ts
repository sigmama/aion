import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { of } from 'rxjs';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import * as UserActions from './user.actions';
import { UserModalComponent } from '../components/modal/user-modal.component';

@Injectable()
export class UserEffects {
  private userModalRef: NbDialogRef<UserModalComponent>;

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUsers),
      mergeMap(() =>
        this.userService
          .getUsers()
          .pipe(map((users) => UserActions.getUsersSuccess({ users })))
      )
    )
  );

  getUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUserRoles),
      mergeMap(() =>
        this.userService.getUserRoles().pipe(
          map((userRoles) =>
            UserActions.getUserRolesSuccess({
              userRoles: userRoles.map((u) => u.role),
            })
          )
        )
      )
    )
  );

  addOrUpdateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addOrUpdateUser),
      mergeMap(({ user, isAdd }) =>
        (isAdd
          ? this.userService.addUser(user)
          : this.userService.updateUser(user)
        ).pipe(
          map(() => UserActions.addOrUpdateUserSuccess()),
          catchError((e) =>
            of(UserActions.addOrUpdateUserFailure({ message: e.error.message }))
          )
        )
      )
    )
  );

  addOrUpdateUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addOrUpdateUserSuccess),
      tap(() => this.userModalRef.close()),
      tap(() => {
        this.toastrService.success(
          'user added/updated successfully',
          'Success',
          { icon: 'alert-circle-outline' }
        );
      }),
      map(() => UserActions.getUsers())
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ userEid }) =>
        this.userService.deleteUser(userEid).pipe(
          map(() => UserActions.deleteUserSuccess({ userEid })),
          catchError((e) =>
            of(UserActions.deleteUserFailure({ message: e.error.message }))
          )
        )
      )
    )
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        tap(() =>
          this.toastrService.success('user deleted successfully', 'Success', {
            icon: 'alert-circle-outline',
          })
        )
      ),
    { dispatch: false }
  );

  deleteUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserFailure),
        tap(({ message }) =>
          this.toastrService.danger(message, 'Error', {
            icon: 'alert-circle-outline',
          })
        )
      ),
    { dispatch: false }
  );

  openUserModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.openUserModal),
        tap(({ context }) => {
          this.userModalRef = this.dialogService.open(UserModalComponent, {
            closeOnEsc: false,
            closeOnBackdropClick: false,
            context,
          });
        })
      ),
    {
      dispatch: false,
    }
  );

  closeUserModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.closeUserModal),
        tap(() => {
          this.userModalRef.close();
        })
      ),
    {
      dispatch: false,
    }
  );
}
