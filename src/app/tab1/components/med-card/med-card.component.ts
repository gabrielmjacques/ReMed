import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-card',
  templateUrl: './med-card.component.html',
  styleUrls: ['./med-card.component.scss'],
})
export class MedCardComponent implements OnInit {
  @Input() name: string = 'Medicamento';
  @Input() type: string = 'Comprimido';
  @Input() quantity: number = 0;
  @Input() animationDelay: number = 0;

  constructor() { }

  ngOnInit() { }

}
