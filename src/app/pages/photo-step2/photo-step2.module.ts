import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoStep2PageRoutingModule } from './photo-step2-routing.module';

import { PhotoStep2Page } from './photo-step2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoStep2PageRoutingModule
  ],
  declarations: [PhotoStep2Page]
})
export class PhotoStep2PageModule {}
