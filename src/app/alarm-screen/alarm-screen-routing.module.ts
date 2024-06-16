import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmScreenPage } from './alarm-screen.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmScreenPageRoutingModule {}
