import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Remedy } from 'src/app/models/remedy';

@Component({
  selector: 'app-med-card',
  templateUrl: './med-card.component.html',
  styleUrls: ['./med-card.component.scss'],
})
export class MedCardComponent {
  @Input() remedy!: Remedy;
  @Input() animationDelay: number = 0;

  constructor(private router: Router) { }

  editRemedy() {
    this.router.navigateByUrl(`edit/${this.remedy.id}`);
  }
}
