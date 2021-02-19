import { createAction, props } from '@ngrx/store';

export const getUsers = createAction('[User | Get Users]');

export const getUsersSuccess = createAction(
  '[User | Get Users Success]',
  props<{ users: any[] }>()
);

export const getUserRoles = createAction('[User | Get User Roles]');

export const getUserRolesSuccess = createAction(
  '[User | Get User Roles Success]',
  props<{ userRoles: any[] }>()
);

export const openUserModal = createAction(
  '[User | Open User Modal]',
  props<{ context: any }>()
);

export const closeUserModal = createAction('[User | close User Modal]');

export const addOrUpdateUser = createAction(
  '[User | Add or Update User]',
  props<{ user: any; isAdd: boolean }>()
);

export const addOrUpdateUserSuccess = createAction(
  '[User | Add or Update User Success]'
);

export const addOrUpdateUserFailure = createAction(
  '[User | Add or Update User Failure]',
  props<{ message: string }>()
);

export const deleteUser = createAction(
  '[User | Delete User]',
  props<{ userEid: string }>()
);

export const deleteUserSuccess = createAction(
  '[User | Delete User Success]',
  props<{ userEid: string }>()
);

export const deleteUserFailure = createAction(
  '[User | Delete User User Failure]',
  props<{ message: string }>()
);
