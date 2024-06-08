import { Component, OnInit } from '@angular/core';
import { RemedyService } from '../services/remedy.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  isDarkMode: boolean = false;

  constructor(private alertCtrl: AlertController, private remedyService: RemedyService) { }

  ngOnInit() {
    this.checkDarkMode();
  }

  checkDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches;
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
  }

  clearData() {
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
          handler: () => {
            this.remedyService.removeAll();
          }
        }
      ]
    }).then(alert => alert.present());
  }

}
