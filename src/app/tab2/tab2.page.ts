import { Component } from '@angular/core';
import { Remedy } from '../models/remedy';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  remedies: Remedy[] = [
  ];

  groupedRemedies: any = {};

  constructor() {
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
