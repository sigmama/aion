import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  NbAuthModule,
  NbAuthJWTToken,
  NbPasswordAuthStrategy,
  NbTokenStorage,
} from '@nebular/auth';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  LayoutService,
  StateService,
  CurrentThemeService,
  HeaderInterceptor,
  NbTokenCustomStorage,
} from './utils';
import { environment } from '../../environments/environment';

export const NB_CORE_PROVIDERS = [
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'ldap',
        baseEndpoint: '',
        login: {
          endpoint: `${environment.siteUrl}:${environment.port}/api/usersignin`,
          method: 'post',
        },
        logout: {
          endpoint: '',
          redirect: {
            success: '/auth/login',
          },
        },
        token: {
          class: NbAuthJWTToken,
          key: 'token',
        },
      }),
    ],
    forms: {
      login: {
        // delay before redirect after a successful login, while success message is shown to the user
        redirectDelay: 1000,
        strategy: 'ldap', // provider id key. If you have multiple strategies, or what to use your own
        rememberMe: false, // whether to show or not the `rememberMe` checkbox
        showMessages: {
          // show/not show success/error messages
          success: true,
          error: true,
        },
      },
      validation: {
        password: {
          required: true,
          minLength: 6,
          maxLength: 50,
        },
        email: {
          required: true,
        },
        userName: {
          required: true,
          minLength: 2,
          maxLength: 50,
        },
      },
    },
  }).providers,
  LayoutService,
  StateService,
  CurrentThemeService,
  // add auth token to headers, prevent caching behavior of ie 11
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  // customize token key in local storage
  { provide: NbTokenStorage, useClass: NbTokenCustomStorage },
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
