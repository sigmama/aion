import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: NbAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let logged: boolean = false;
    return this.authService.getToken().pipe(
      map((token: NbAuthJWTToken) => {
        if (!token.isValid()) {
          return false;
        }
        logged = true;
        const userRoles: string[] = [token.getPayload()['role'], '*'];
        const routeRoles: [] = route.data.roles;
        return routeRoles.some((r) => userRoles.includes(r));
      }),
      tap((authorized) => {
        if (!authorized) {
          if (logged) {
            this.router.navigateByUrl('/pages/forbidden');
          } else {
            this.router.navigateByUrl(`/auth/login?returnUrl=${state.url}`);
          }
        }
      })
    );
  }
}
