import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DamagedCarPage } from './damaged-car.page';

const routes: Routes = [
  {
    path: '',
    component: DamagedCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamagedCarPageRoutingModule {}