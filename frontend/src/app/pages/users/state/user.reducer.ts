import {
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as FromRoot from '../../../state/app.reducer';
import * as UserActions from './user.actions';

export interface State extends FromRoot.State {
  user: UserState;
}

export interface UserState {
  users: any[];
  userRoles: any[];
  teams: string[];
  errMsgAddOrUpdateUser: string;
}

const initialState = {
  users: [],
  userRoles: [],
  teams: [],
  errMsgAddOrUpdateUser: '',
};

export const getUserFeatureState = createFeatureSelector<UserState>(
  'userState'
);

export const getUsers = createSelector(
  getUserFeatureState,
  (state) => state.users
);

export const getUserRoles = createSelector(
  getUserFeatureState,
  (state) => state.userRoles
);

export const getTeams = createSelector(
  getUserFeatureState,
  (state) => state.teams
);

export const getErrMsgAddOrUpdateUser = createSelector(
  getUserFeatureState,
  (state) => state.errMsgAddOrUpdateUser
);

export const reducer = createReducer(
  initialState,
  on(UserActions.getUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(UserActions.getUserRolesSuccess, (state, { userRoles }) => ({
    ...state,
    userRoles,
  })),
  on(UserActions.deleteUserSuccess, (state, { userEid }) => ({
    ...state,
    users: state.users.filter((u) => u.userEid !== userEid),
  })),
  on(UserActions.addOrUpdateUserFailure, (state, { message }) => ({
    ...state,
    errMsgAddOrUpdateUser: message,
  }))
);
