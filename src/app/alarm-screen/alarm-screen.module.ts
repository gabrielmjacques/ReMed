import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmScreenPageRoutingModule } from './alarm-screen-routing.module';

import { AlarmScreenPage } from './alarm-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmScreenPageRoutingModule
  ],
  declarations: [AlarmScreenPage]
})
export class AlarmScreenPageModule {}
