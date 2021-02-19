import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params,
} from '@angular/router';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

export interface State {
  routerState: fromRouter.RouterReducerState<RouterStateUrl>;
}

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export const rootReducer: ActionReducerMap<State> = {
  routerState: fromRouter.routerReducer,
};

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerState');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;
    return { url, queryParams, params };
  }
}
