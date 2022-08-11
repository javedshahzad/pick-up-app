import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoStep1PageRoutingModule } from './photo-step1-routing.module';

import { PhotoStep1Page } from './photo-step1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoStep1PageRoutingModule
  ],
  declarations: [PhotoStep1Page]
})
export class PhotoStep1PageModule {}
