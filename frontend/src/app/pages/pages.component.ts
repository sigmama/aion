import { Component, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="visibleMenus$ | async"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  visibleMenus$: Observable<any[]>;
  constructor(private authService: NbAuthService) {}

  ngOnInit() {
    this.visibleMenus$ = this.authService.onTokenChange().pipe(
      map((token) =>
        MENU_ITEMS.filter((m) => this.isMenuVisible(m, token)).map((m) => {
          if (!m.children) {
            return m;
          }
          return {
            ...m,
            children: m.children.filter((sm) => this.isMenuVisible(sm, token)),
          };
        })
      )
    );
  }

  isMenuVisible(m, token) {
    if (token.isValid() && m.data) {
      if (m.data.roles && m.data.roles.includes('*')) return true;
    }

    // console.log(token.getPayload()['role']);
    const userRoles: string[] = token.isValid()
      ? [token.getPayload()['role'], 'Guest']
      : ['Guest'];

    const menuRoles: string[] = m.data ? m.data.roles || ['Guest'] : ['Guest'];
    return menuRoles.some((r) => userRoles.includes(r));
  }
}
