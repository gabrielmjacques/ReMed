import { Component, OnInit } from '@angular/core';
import { Remedy } from '../models/remedy';
import { RemedyService } from '../services/remedy.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { PrefsService } from '../services/prefs.service';
import { LocalNotificationsService } from '../services/local-notifications.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  isIntroductionDone: boolean = false;
  remedies: Remedy[] = [];

  constructor(
    private remedyService: RemedyService,
    private prefsService: PrefsService,
    private alertCtrl: AlertController,
    private localNotificationsService: LocalNotificationsService
  ) { }

  // Método chamado quando a página é carregada
  async ngOnInit() {
    this.loadRemedies();

    this.prefsService.getPref('isIntroductionDone').then(isDone => isDone ? null : this.showIntroduction());
  }

  // Método chamado toda vez que a página é exibida
  ionViewWillEnter() {
    this.loadRemedies();
  }

  /**
   * Exibe uma sequência de alertas para introduzir o usuário ao aplicativo
   */
  firstAlert() {
    this.alertCtrl.create({
      header: 'Bem-vindo ao Remedy!',
      mode: 'ios',
      backdropDismiss: false,
      translucent: true,
      message: 'Aqui você pode cadastrar seus remédios e ser lembrado de tomá-los.',
      buttons: [{ text: 'Entendi', handler: () => this.secondAlert() }]

    }).then(alert => alert.present());
  }

  /**
   * Exibe um alerta para pedir permissão de notificações
   */
  secondAlert() {
    this.alertCtrl.create({
      header: 'Como começo?',
      mode: 'ios',
      backdropDismiss: false,
      translucent: true,
      message: 'Primeiro, eu preciso que você permita que eu envie notificações para você, tudo bem?',
      buttons: [{
        text: 'Claro!', handler: () => {

          // Solicita permissão de notificações
          LocalNotifications.requestPermissions()
            .then(perm => {

              // Se a permissão foi concedida, exibe o próximo alerta
              if (perm.display === 'granted') {
                this.thirdAlert();

                // Se a permissão foi negada, exibe um alerta pedindo para o usuário abrir as configurações e permitir as notificações
              } else {
                this.alertCtrl.create({
                  header: 'Ops!',
                  mode: 'ios',
                  backdropDismiss: false,
                  translucent: true,
                  message: 'Você precisa permitir as notificações do aplicativo para continuar',
                  buttons: [{
                    text: 'Abrir configurações',
                    handler: async () => {
                      NativeSettings.open({
                        optionAndroid: AndroidSettings.AppNotification,
                        optionIOS: IOSSettings.App
                      });
                    }
                  }],
                }).then(alert => alert.present());
              }
            });
        }
      }]

    }).then(alert => alert.present());
  }

  thirdAlert() {
    this.alertCtrl.create({
      header: 'E agora?',
      mode: 'ios',
      backdropDismiss: false,
      translucent: true,
      message: 'Agora é só clicar no botão de adicionar e preencher os campos para cadastrar um novo remédio.',
      buttons: [{ text: 'Entendi', handler: () => this.prefsService.savePref('isIntroductionDone', true) }]
    }).then(alert => alert.present());
  }

  async showIntroduction() {
    this.firstAlert();
  }

  loadRemedies() {
    this.remedyService.getAll().then(remedies => this.remedies = remedies || []);
  }

}
