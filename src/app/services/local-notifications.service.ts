import { Injectable } from '@angular/core';
import { LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { Remedy } from '../models/remedy';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {
  private REMEDY_CHANNEL_ID = 'remedy';

  constructor() {
    this.createChannel();
  }

  createChannel() {
    LocalNotifications.createChannel({
      id: this.REMEDY_CHANNEL_ID,
      name: 'ReMedy',
      description: 'Canal de notificações do ReMedy',
      importance: 5,
      vibration: true,
    });
  }

  set(notifications: LocalNotificationSchema[]) {
    LocalNotifications.schedule({
      notifications: notifications
    });
  }

  setByRemedy(remedy: Remedy) {
    let notifications: LocalNotificationSchema[] = [];

    let endAt = new Date(remedy.startAt);
    endAt.setDate(endAt.getDate() + remedy.days);

    let currentDate = new Date(remedy.startAt);

    // Agendando as notificações de acordo com o intervalo até a data final (que é a data de início + dias)
    while (currentDate < endAt) {

      // Criação do objeto de notificação
      let notification: LocalNotificationSchema = {
        id: remedy.id + Math.random() * 1000,
        channelId: this.REMEDY_CHANNEL_ID,
        title: `${remedy.name} - ${remedy.type}`,
        body: `Você deve tomar ${remedy.doses} doses do medicamento ${remedy.name} - ${remedy.type}`,
        schedule: {
          at: new Date(currentDate) // Data e hora da notificação
        }
      };

      notifications.push(notification);
      currentDate.setHours(currentDate.getHours() + remedy.interval); // Adiciona o intervalo de horas
    }

    remedy.notifications = notifications;
    this.set(notifications);
  }

  async removeAll() {
    const notifications = await LocalNotifications.getPending();
    await LocalNotifications.cancel(notifications);
  }
}