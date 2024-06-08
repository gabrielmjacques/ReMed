import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() { this.initializeApp(); }

  initializeApp() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.classList.toggle('ion-palette-dark', prefersDark.matches);
  }
}
