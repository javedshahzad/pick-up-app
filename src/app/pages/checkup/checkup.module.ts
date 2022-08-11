import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckupPageRoutingModule } from './checkup-routing.module';

import { CheckupPage } from './checkup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckupPageRoutingModule
  ],
  declarations: [CheckupPage]
})
export class CheckupPageModule {}
