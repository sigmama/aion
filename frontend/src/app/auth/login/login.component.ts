import {
  Component,
  Inject,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  NbAuthService,
  NbAuthResult,
  NB_AUTH_OPTIONS,
  NbLoginComponent,
} from '@nebular/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { CurrentThemeService } from '../../@core/utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent
  extends NbLoginComponent
  implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  returnUrl: string;
  currentTheme = 'default';

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(NB_AUTH_OPTIONS) options = {},
    service: NbAuthService,
    private currentThemeService: CurrentThemeService,
    private themeService: NbThemeService,
    cd: ChangeDetectorRef,
    router: Router
  ) {
    super(service, options, cd, router);
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];

    const localTheme = this.currentThemeService.getCurrentTheme();
    if (this.currentTheme !== localTheme) {
      this.currentTheme = localTheme;
      this.themeService.changeTheme(localTheme);
    }

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service
      .authenticate(this.strategy, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: NbAuthResult) => {
          this.submitted = false;
          if (result.isSuccess()) {
            this.showMessages.success = 'login succeeded!';
            this.messages.push('login successfully, redirecting ...');
            setTimeout(() => {
              if (this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl);
              } else {
                this.router.navigate(['/']);
              }
            }, this.redirectDelay);
          } else {
            const errmsg =
              result.getResponse().error.message || 'internal server error';
            this.showMessages.error = 'login failed!';
            this.errors.push(errmsg);
          }

          this.cd.detectChanges();
        },
        (err) => this.errors.push('internal server error')
      );
  }
}
