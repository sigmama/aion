import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { NbAuthService } from '@nebular/auth';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.getToken().pipe(
      switchMap((token) => {
        const httpRequest = req.clone({
          headers: new HttpHeaders({
            Authorization: token.isValid() ? 'token ' + token : '',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
          }),
        });

        return next.handle(httpRequest);
      })
    );
  }
}
