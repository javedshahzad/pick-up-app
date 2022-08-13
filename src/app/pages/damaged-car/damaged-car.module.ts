import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DamagedCarPageRoutingModule } from './damaged-car-routing.module';

import { DamagedCarPage } from './damaged-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DamagedCarPageRoutingModule
  ],
  declarations: [DamagedCarPage]
})
export class DamagedCarPageModule {}
