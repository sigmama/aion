import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Router } from '@angular/router';
import { CurrentThemeService } from '../../../@core/utils';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  loggedAccount: any;

  themes = [
    {
      value: 'default',
      name: 'LIGHT GRAY',
    },
    {
      value: 'light-mixed',
      name: 'LIGHT MIXED',
    },
    {
      value: 'cosmic',
      name: 'DARK PURPLE',
    },
    {
      value: 'dark-mixed',
      name: 'DARK MIXED',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Log Out', icon: 'log-out-outline' }];
  anonymousMenu = [{ title: 'Login', icon: 'log-in-outline' }];

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private currentThemeService: CurrentThemeService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
  ) {}

  ngOnInit() {
    this.authService
      .onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.loggedAccount = token.getPayload();
        }
      });

    this.menuService
      .onItemClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onItemSelection(event.item.title));

    // change theme to previous selection
    const localTheme = this.currentThemeService.getCurrentTheme();
    if (this.currentTheme !== localTheme) {
      this.currentTheme = localTheme;
      this.themeService.changeTheme(localTheme);
    }

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  onItemSelection(title) {
    if (title === 'Log Out') {
      this.authService.logout('ldap').subscribe((r) => {
        this.loggedAccount = null;
        this.router.navigateByUrl('/auth/login');
      });
    } else if (title === 'Login') {
      this.router.navigateByUrl('/auth/login');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.currentThemeService.setCurrentTheme(themeName);
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
