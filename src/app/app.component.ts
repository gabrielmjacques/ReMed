import { Component } from '@angular/core';
import { LocalNotificationsService } from './services/local-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private localNotificationsService: LocalNotificationsService) { this.initializeApp(); }

  initializeApp() {
    this.localNotificationsService.initLocalNotifications();
  }
}
