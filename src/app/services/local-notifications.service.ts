import { Injectable } from '@angular/core';
import { LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { Remedy } from '../models/remedy';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {
  private REMEDY_CHANNEL_ID = 'remedy';

  constructor(private router: Router) {
    this.initLocalNotifications();
  }

  /**
   * Inicializa o canal de notificações e o listener para notificações
   */
  initLocalNotifications() {
    LocalNotifications.createChannel({
      id: this.REMEDY_CHANNEL_ID,
      name: 'ReMed',
      description: 'Canal de notificações do ReMed',
      importance: 5,
      vibration: true,
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      this.router.navigateByUrl(`/alarm-screen/${action.notification.extra.remedyId}/${action.notification.id}`);
    });
  }

  /**
   * Agendamento de notificações locais
   * @param notifications Array de notificações a serem agendadas
   */
  set(notifications: LocalNotificationSchema[]) {
    LocalNotifications.schedule({
      notifications: notifications
    });
  }

  /**
   * Agendamento de notificações locais a partir de um remédio
   * @param remedy Remédio a ser agendado
   */
  setByRemedy(remedy: Remedy) {
    // Objeto de notificações
    let notifications: LocalNotificationSchema[] = [];

    let endAt = new Date(remedy.startAt);
    endAt.setDate(endAt.getDate() + remedy.days);

    let currentDate = new Date(remedy.startAt);

    // Agendando as notificações de acordo com o intervalo até a data final (que é a data de início + dias definidos)
    while (currentDate < endAt) {

      // Objeto de notificação
      let notification: LocalNotificationSchema = {
        id: remedy.id + Math.random() * 1000,
        channelId: this.REMEDY_CHANNEL_ID,
        actionTypeId: 'remedy_notification',
        title: `Hora do Remédio`,
        body: `Você deve tomar ${remedy.doses} dose/s do medicamento ${remedy.name} - ${remedy.type}`,
        schedule: {
          at: new Date(currentDate),
          allowWhileIdle: true
        },
        extra: {
          remedyId: remedy.id
        }
      };

      // Adiciona a notificação ao array de notificações
      notifications.push(notification);

      // Adiciona o intervalo de horas
      currentDate.setHours(currentDate.getHours() + remedy.interval);
    }

    // Adiciona as notificações ao objeto de remédio
    remedy.notifications = notifications;

    // Agendamento das notificações
    this.set(notifications);
  }

  /**
   * Remove todas as notificações agendadas
   */
  async removeAll() {
    const notifications = await LocalNotifications.getPending();
    await LocalNotifications.cancel(notifications);
  }
}