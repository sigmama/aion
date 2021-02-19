import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
