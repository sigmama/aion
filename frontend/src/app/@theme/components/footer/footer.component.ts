import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentDate: Date = new Date();
  isStartYear: boolean = new Date().getFullYear() === 2020;
}
