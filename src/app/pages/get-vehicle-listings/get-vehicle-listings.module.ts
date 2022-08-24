import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetVehicleListingsPageRoutingModule } from './get-vehicle-listings-routing.module';

import { GetVehicleListingsPage } from './get-vehicle-listings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetVehicleListingsPageRoutingModule
  ],
  declarations: [GetVehicleListingsPage]
})
export class GetVehicleListingsPageModule {}
