import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetVehicleListingsPage } from './get-vehicle-listings.page';

const routes: Routes = [
  {
    path: '',
    component: GetVehicleListingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetVehicleListingsPageRoutingModule {}
