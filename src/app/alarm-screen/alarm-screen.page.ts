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

      this.remedyService.remedies$.subscribe(remedies => {
        this.remedy = remedies.find(remedy => remedy.id == remedyId);
        this.notification = this.remedy!.notifications.find(notification => notification.id == notificationId);
      });

    });
  }

  removeCurrentNotification() {
    const notifications = this.remedy!.notifications.filter(notification => notification.id != this.notification!.id);
    this.remedy!.notifications = notifications;

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
    const minutes = 5;

    // Criando uma nova notificação com ${minutes} minutos de diferença
    let newNotification: LocalNotificationSchema = {
      id: this.remedy!.id + Math.random() * 1000,
      channelId: this.localNotificationsService.REMEDY_CHANNEL_ID,
      actionTypeId: 'remedy_notification',
      title: `Hora do Remédio`,
      body: `Você deve tomar ${this.remedy!.doses} dose/s do medicamento ${this.remedy!.name} - ${this.remedy!.type}`,
      schedule: {
        at: new Date(Date.now() + minutes * 60 * 1000),
        allowWhileIdle: true
      },
      extra: {
        remedyId: this.remedy!.id
      }
    };

    let newRemedy = new Remedy(
      this.remedy!.name,
      this.remedy!.type,
      this.remedy!.doses,
      this.remedy!.interval,
      this.remedy!.startAt,
      this.remedy!.days,
      this.remedy!.id
    );

    this.remedy!.notifications.shift();
    newRemedy.notifications = this.remedy?.notifications!;
    newRemedy.notifications.unshift(newNotification);

    this.remedyService.update(newRemedy);

    this.router.navigateByUrl('tabs/tab1');
  }

}
