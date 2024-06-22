import { Injectable } from '@angular/core';
import { LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { Remedy } from '../models/remedy';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {
  REMEDY_CHANNEL_ID = 'remedy';

  constructor(private router: Router) {
    this.initLocalNotifications();
  }

  /**
   * Inicializa o canal de notificações e o listener para notificações
   */
  async initLocalNotifications() {
    await LocalNotifications.createChannel({
      id: this.REMEDY_CHANNEL_ID,
      name: 'ReMed',
      description: 'Canal de notificações do ReMed',
      importance: 5,
      vibration: true,
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      this.router.navigateByUrl(`/alarm-screen/${action.notification.extra.remedyId}/${action.notification.id}`);
    });
  }

  /**
   * Agendamento de notificações locais
   * @param notifications Array de notificações a serem agendadas
   */
  async set(notifications: LocalNotificationSchema[]) {
    await LocalNotifications.schedule({
      notifications: notifications
    });
  }

  async calculateNotifications(remedy: Remedy) {
    let endAt = new Date(remedy.startAt);
    endAt.setDate(endAt.getDate() + remedy.days);

    let currentDate = new Date(remedy.startAt);

    let notifications: LocalNotificationSchema[] = [];

    while (currentDate < endAt) {
      let notification: LocalNotificationSchema = {
        id: remedy.id + Math.random() * 1000,
        channelId: this.REMEDY_CHANNEL_ID,
        actionTypeId: 'remedy_notification',
        title: `Hora do Remédio - ${remedy.name}`,
        body: `Você deve tomar ${remedy.doses} dose/s do medicamento ${remedy.name} - ${remedy.type}`,
        schedule: {
          at: new Date(currentDate),
          allowWhileIdle: true
        },
        extra: {
          remedyId: remedy.id
        }
      };

      notifications.push(notification);

      currentDate.setHours(currentDate.getHours() + remedy.interval);
    }

    return notifications;
  }

  /**
   * Remove todas as notificações agendadas
   */
  async removeAll() {
    const notifications = await LocalNotifications.getPending();
    await LocalNotifications.cancel(notifications);
  }

  /**
   * Remove todas as notificações de um remédio
   * @param remedy Remédio a ser removido
   */
  async removeByRemedy(remedy: Remedy) {
    let notifications = await LocalNotifications.getPending();

    // Filtra as notificações do remédio
    const filteredNotifications = notifications.notifications.filter(notification => {
      return notification.extra.remedyId == remedy.id;
    });

    // Cancela as notificações do remédio
    await LocalNotifications.cancel({ notifications: filteredNotifications });

    notifications = await LocalNotifications.getPending();

  }
}