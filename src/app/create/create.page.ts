import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Remedy } from '../models/remedy';
import { LocalNotificationsService } from '../services/local-notifications.service';
import { RemedyService } from '../services/remedy.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  public name: string | undefined;
  public type: string = 'Comprimido';
  public doses: number | undefined;
  public interval: number | undefined;

  public startAt: Date = new Date();
  public days: number = 1;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private remedyService: RemedyService,
    private localNotifications: LocalNotificationsService
  ) { }

  /**
   * Reseta o formulário
   */
  resetForm() {
    this.name = '';
    this.doses = undefined;
    this.interval = undefined;
    this.startAt = new Date();
    this.days = 1;
  }

  /**
   * Verifica se os dados inseridos são válidos
   * @returns true se os dados são válidos, false caso contrário
   */
  isDataValid() {
    if (!this.name || !this.doses || !this.interval) {
      alert("Preencha todos os campos");
      return false;

    } else if (this.doses < 1 || this.interval < 1) {
      alert("Quantidade e intervalo devem ser maiores que 0");
      return false;

    } else if (this.startAt < new Date()) {
      alert("Data de início deve ser maior que a data atual");
      return false;
    }

    return true;
  }

  /**
   * Capitaliza as palavras de um texto
   * @example captalizeWords('remedio de dor') // 'Remedio de Dor'
   * @param value Texto a ser capitalizado
   * @returns Texto capitalizado
   */
  captalizeWords(value: string) {
    return value.split(' ').map(word => {
      if (word.length < 3) return word.toLowerCase();

      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  /**
   * Define a data inicial
   * @param event Evento de mudança de data
   */
  setInitialTime(event: CustomEvent) {
    this.startAt = new Date(event.detail.value);
  }

  /**
   * Cria um novo remédio
   */
  createMedicine() {
    // Verifica se os dados são válidos
    if (!this.isDataValid())
      return;

    const remedy = new Remedy(this.captalizeWords(this.name!), this.type, this.doses!, this.interval!, this.startAt, this.days);

    // Adiciona o remédio ao serviço
    this.remedyService.push(remedy);

    // Exibe um alerta de sucesso
    this.alertCtrl.create({
      translucent: true,
      mode: "ios",
      header: "Remédio criado",
      message: `Você será lembrado de tomar ${remedy.name} a cada ${remedy.interval} horas`,
      buttons: [{
        text: "Voltar",
        handler: () => {
          this.resetForm();
          this.navCtrl.back();
        }
      }]
    }).then(alert => alert.present());
  }

}
