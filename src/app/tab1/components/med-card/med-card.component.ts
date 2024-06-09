import { Component, Input, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Remedy } from 'src/app/models/remedy';

@Component({
  selector: 'app-med-card',
  templateUrl: './med-card.component.html',
  styleUrls: ['./med-card.component.scss'],
})
export class MedCardComponent implements OnInit {
  @Input() remedy!: Remedy;
  @Input() animationDelay: number = 0;

  constructor() { }

  ngOnInit() { }
}
