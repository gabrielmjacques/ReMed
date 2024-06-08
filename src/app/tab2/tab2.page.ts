import { Component } from '@angular/core';
import { Remedy } from '../models/remedy';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  remedies: Remedy[] = [
    new Remedy('Paracetamol', "Comprimido", 2, 8, new Date('2023-01-01T08:14:32')),
    new Remedy('Amoxilina', 'Comprimido', 1, 12, new Date('2023-02-15T12:35:14')),
    new Remedy('Ibuprofeno', 'Comprimido', 1, 8, new Date('2023-02-23T08:12:32')),
    new Remedy('Dipirona', 'Comprimido', 1, 8, new Date('2023-02-23T08:12:32'))
  ];

  groupedRemedies: any = {};

  constructor() {
    // Adicionando dados de confirmação como exemplo
    this.remedies[0].confirmedDates.push(new Date('2023-01-01T08:18:34'), new Date('2023-01-01T08:14:32'), new Date('2023-01-01T08:14:32'));
    this.remedies[1].confirmedDates.push(new Date('2023-02-15T12:35:14'));
    this.remedies[2].confirmedDates.push(new Date('2023-02-23T08:12:32'), new Date('2023-03-01T08:14:32'));
    this.remedies[3].confirmedDates.push(new Date('2023-02-23T08:12:32'), new Date('2023-02-15T12:35:14'));
  }

  ngOnInit() {
    this.groupRemediesByDate();
  }

  groupRemediesByDate() {
    this.remedies.forEach(remedy => {
      remedy.confirmedDates.forEach(date => {

        const dateKey = date.toISOString().split('T')[0];

        if (!this.groupedRemedies[dateKey]) {
          this.groupedRemedies[dateKey] = [];
        }

        this.groupedRemedies[dateKey].unshift(remedy);  // Adiciona o remédio no início da lista
      });
    });
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj).sort((a, b) => b.localeCompare(a));
  }

  // formatTime(date: Date): string {
  //   console.log(date);
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${hours}:${minutes}h`;
  // }

}
