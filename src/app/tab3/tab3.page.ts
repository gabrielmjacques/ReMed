import { Component, OnInit } from '@angular/core';
import { LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { RemedyService } from '../services/remedy.service';
import { StorageService } from '../services/storage.service';
import { LocalNotificationsService } from '../services/local-notifications.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  notifications!: PendingLocalNotificationSchema[];
  isDarkMode: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private remedyService: RemedyService,
    private storageService: StorageService,
    private localNotificationsService: LocalNotificationsService
  ) { }

  async ngOnInit() {
    this.checkDarkMode();
  }

  ionViewWillEnter() {
    this.getPendingNotifications();
  }

  async getPendingNotifications() {
    const pending = await LocalNotifications.getPending();
    this.notifications = pending.notifications;
  }

  /**
   * Checa se o sistema está em modo escuro
   */
  checkDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches;
  }

  /**
   * Alterna entre os modos claro e escuro
   */
  toggleDarkMode() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
  }

  /**
   * Limpa todos os remédios cadastrados
   */
  clearRemedies() {
    this.alertCtrl.create({
      mode: 'ios',
      translucent: true,
      header: 'Confirmação',
      subHeader: 'Deseja realmente apagar todos os remédios?',
      message: 'Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          cssClass: 'alert',
          handler: async () => {
            await this.remedyService.removeAll();
            await this.localNotificationsService.removeAll();
            await this.getPendingNotifications();
          }
        }
      ]
    }).then(alert => alert.present());
  }

  /**
   * Limpa todos os dados do aplicativo
   */
  clearAllData() {
    this.alertCtrl.create({
      mode: 'ios',
      translucent: true,
      header: 'Confirmação',
      subHeader: 'Deseja realmente apagar todos os dados?',
      message: 'Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          cssClass: 'alert',
          handler: async () => {
            await this.storageService.clear();
            await this.remedyService.removeAll();
            await this.localNotificationsService.removeAll();
            await this.getPendingNotifications();
          }
        }
      ]
    }).then(alert => alert.present());
  }

}
