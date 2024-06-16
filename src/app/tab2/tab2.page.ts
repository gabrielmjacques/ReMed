import { Component } from '@angular/core';
import { Remedy } from '../models/remedy';
import { RemedyService } from '../services/remedy.service';
import { LocalNotificationSchema } from '@capacitor/local-notifications';

interface IGroupedNotifications {
  [key: string]: {
    remedy: Remedy;
    notification: LocalNotificationSchema;
  }[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  today: string = new Date().toISOString().split('T')[0];

  remedies: Remedy[] = [];
  groupedNotifications: IGroupedNotifications = {};

  constructor(private remedyService: RemedyService) { }

  async ionViewWillEnter() {
    const remedies = await this.remedyService.getAll();
    this.remedies = remedies;

    this.groupNotificationsByDate();
  }

  /**
   * Agrupa os remédios por data e ordena os remédios por data crescente
   */
  groupNotificationsByDate() {
    // Reseta o objeto de notificações agrupadas
    this.groupedNotifications = {};

    // Itera sobre todos os remédios
    this.remedies.forEach(remedy => {
      // Itera sobre todas as notificações de um remédio
      remedy.notifications.forEach(notification => {
        // Pega a data da notificação
        const date = new Date(notification.schedule?.at!);

        // Corrige a data para considerar o fuso horário
        const correctedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

        // Formata a data para o padrão 'yyyy-MM-dd'
        const formattedDate = correctedDate.toISOString().split('T')[0];

        // Se a data não existir no objeto agrupado, cria um array vazio
        if (!this.groupedNotifications[formattedDate]) {
          this.groupedNotifications[formattedDate] = [];
        }

        // Adiciona a notificação ao array da data
        this.groupedNotifications[formattedDate].push({
          remedy,
          notification
        });
      });
    });

    // Ordena os remédios dentro de cada grupo de notificações por data crescente
    for (const key in this.groupedNotifications) {
      if (this.groupedNotifications.hasOwnProperty(key)) {
        this.groupedNotifications[key].sort((a, b) => {
          const dateA = new Date(a.notification.schedule?.at!);
          const dateB = new Date(b.notification.schedule?.at!);
          return dateA.getTime() - dateB.getTime();
        });
      }
    }
  }

  // Pega as chaves do objeto
  getKeys(obj: any): string[] {
    return Object.keys(obj).sort((a, b) => a > b ? 1 : -1);
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}h`;
  }
}
