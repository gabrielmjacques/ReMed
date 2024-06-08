import { Component, Input, OnInit } from '@angular/core';
import { Remedy } from '../models/remedy';
import { AlertController, NavController } from '@ionic/angular';
import { RemedyService } from '../services/remedy.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  @Input() name: string | undefined;
  @Input() type: string = 'comprimido';
  @Input() quantity: number | undefined;
  @Input() interval: number | undefined;

  @Input() startAt: Date = new Date();

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private remedyService: RemedyService
  ) { }

  isDataValid() {
    if (!this.name || !this.quantity || !this.interval) {
      alert("Preencha todos os campos");
      return false;

    } else if (this.quantity < 1 || this.interval < 1) {
      alert("Quantidade e intervalo devem ser maiores que 0");
      return false;

    } else if (this.startAt < new Date()) {
      alert("Data de início deve ser maior que a data atual");
      return false;
    }

    return true;
  }

  captalizeWords(value: string) {
    return value.split(' ').map(word => {
      if (word.length < 3) return word.toLowerCase();

      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  async createMedicine() {
    // Verifica se os dados são válidos
    if (!this.isDataValid())
      return;

    const remedy = new Remedy(this.captalizeWords(this.name!), this.type, this.quantity!, this.interval!, this.startAt);

    // Adiciona o remédio ao serviço
    this.remedyService.push(remedy);

    // Exibe um alerta de sucesso
    this.alertCtrl.create({
      translucent: true,
      mode: "ios",
      header: "Remédio criado",
      message: "Remédio criado com sucesso",
      buttons: [{
        text: "Voltar",
        handler: () => {
          this.navCtrl.back();
        }
      }]
    }).then(alert => alert.present());
  }

  setInitialTime(event: CustomEvent) {
    this.startAt = new Date(event.detail.value);
  }

}
