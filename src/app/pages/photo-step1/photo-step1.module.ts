import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoStep1PageRoutingModule } from './photo-step1-routing.module';

import { PhotoStep1Page } from './photo-step1.page';
import { DamagedCarPage } from '../damaged-car/damaged-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoStep1PageRoutingModule,
  ],
  declarations: [PhotoStep1Page,DamagedCarPage]
})
export class PhotoStep1PageModule {}
