import { Component, OnInit } from '@angular/core';
import { Remedy } from '../models/remedy';
import { RemedyService } from '../services/remedy.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  remedies: Remedy[] = [];

  constructor(private remedyService: RemedyService) {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.loadRemedies();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.loadRemedies();
  }

  loadRemedies() {
    this.remedyService.getAll().then(remedies => this.remedies = remedies || []);
  }

}
