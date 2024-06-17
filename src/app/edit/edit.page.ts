import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Remedy } from '../models/remedy';
import { RemedyService } from '../services/remedy.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  oldRemedy: Remedy | undefined;

  name: string | undefined;
  type: string = 'comprimido';
  doses: number | undefined;

  constructor(
    private navCtrl: NavController,
    private remedyService: RemedyService,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.remedyService.getById(Number(id)).then(remedy => {
      if (remedy) {
        this.oldRemedy = remedy;

        this.name = remedy.name;
        this.type = remedy.type;
        this.doses = remedy.doses;
      }
    });
  }

  /**
   * Verifica se os dados inseridos são válidos
   * @returns true se os dados são válidos, false caso contrário
   */
  isDataValid() {
    if (!this.name || !this.doses) {
      alert("Preencha todos os campos");
      return false;

    } else if (this.doses < 1) {
      alert("Quantidade deve ser maior que 0");
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
   * Cria um novo remédio
   */
  updateMedicine() {

    if (!this.isDataValid()) return;

    const remedy = this.oldRemedy!;
    remedy.name = this.captalizeWords(this.name!);
    remedy.type = this.type;
    remedy.doses = this.doses!;

    this.remedyService.update(remedy).then(() => {
      this.navCtrl.navigateBack('tabs/tab1');
    });
  }

  deleteMedicine() {
    this.alertCtrl.create({
      mode: 'ios',
      translucent: true,
      header: 'Confirmação',
      subHeader: 'Deseja realmente apagar este remédio?',
      message: 'Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          cssClass: 'alert',
          handler: async () => this.remedyService.removeByRemedy(this.oldRemedy!).then(() => this.navCtrl.navigateBack('tabs/tab1'))
        }
      ]
    }).then(alert => alert.present());
  }
}
