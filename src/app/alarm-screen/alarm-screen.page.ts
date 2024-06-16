import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { Remedy } from '../models/remedy';
import { LocalNotificationsService } from '../services/local-notifications.service';
import { RemedyService } from '../services/remedy.service';

@Component({
  selector: 'app-alarm-screen',
  templateUrl: './alarm-screen.page.html',
  styleUrls: ['./alarm-screen.page.scss'],
})
export class AlarmScreenPage implements OnInit {
  notification: LocalNotificationSchema | undefined;
  remedy: Remedy | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private remedyService: RemedyService,
    private localNotificationsService: LocalNotificationsService
  ) {

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const remedyId = params['remedyid'];
      const notificationId = params['notificationid'];

      this.remedyService.getById(remedyId).then(remedy => {
        this.remedy = remedy;
        this.notification = remedy?.notifications.find(notification => notification.id == notificationId);
      });
    });
  }

  removeCurrentNotification() {
    const updatedNotifications = this.remedy!.notifications.filter(notification => notification.id != this.notification!.id);
    this.remedy!.notifications = updatedNotifications;

    this.remedyService.update(this.remedy!);
  }

  reject() {
    this.removeCurrentNotification();

    this.router.navigateByUrl('tabs/tab1');
  }

  accept() {
    this.removeCurrentNotification();

    this.router.navigateByUrl('tabs/tab1');
  }

  snooze() {
    this.removeCurrentNotification();

    // Criando uma nova notificação com 5 minutos de diferença
    this.notification!.schedule = { at: new Date(Date.now() + 60000 * 5) };

    // Agendando a notificação
    this.localNotificationsService.set([this.notification!]);
    this.router.navigateByUrl('tabs/tab1');

    // Atualizando o remédio
    this.remedy!.notifications.push(this.notification!);
    this.remedyService.update(this.remedy!);
  }

}
