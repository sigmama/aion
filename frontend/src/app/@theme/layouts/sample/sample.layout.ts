import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { delay, withLatestFrom, takeUntil } from 'rxjs/operators';
import {
  NbLayoutComponent,
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'">
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
        [end]="isMenuSidebarPositionEnd()"
      >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class SampleLayoutComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  layout: any = {};
  sidebar: any = {};

  currentTheme: string;

  @ViewChild(NbLayoutComponent, { static: false })
  layoutComponent: NbLayoutComponent;

  constructor(
    protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    @Inject(PLATFORM_ID) protected platformId
  ) {}

  ngOnInit() {
    this.stateService
      .onLayoutState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((layout) => (this.layout = layout));

    this.stateService
      .onSidebarState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sidebar) => (this.sidebar = sidebar));

    const isBp = this.bpService.getByName('is');
    this.menuService
      .onItemSelect()
      .pipe(
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
        takeUntil(this.destroy$)
      )
      .subscribe(
        ([item, [bpFrom, bpTo]]: [
          any,
          [NbMediaBreakpoint, NbMediaBreakpoint]
        ]) => {
          if (bpTo.width <= isBp.width) {
            this.sidebarService.collapse('menu-sidebar');
          }
        }
      );

    this.themeService
      .getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => (this.currentTheme = theme.name));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMenuSidebarPositionEnd(): boolean {
    return this.sidebar.id === 'end';
  }

  isSettingsSidebarPositionEnd(): boolean {
    return !this.isMenuSidebarPositionEnd();
  }
}
