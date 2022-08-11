import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Listings', url: '/tabs', icon: 'mail' },
    { title: 'Picture pending', url: '/pendings', icon: 'paper-plane' },
    { title: 'Logout', url: '/login', icon: 'heart' },
  ];
  constructor() {}
}
