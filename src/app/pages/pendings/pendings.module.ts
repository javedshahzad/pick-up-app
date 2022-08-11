import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingsPageRoutingModule } from './pendings-routing.module';

import { PendingsPage } from './pendings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingsPageRoutingModule
  ],
  declarations: [PendingsPage]
})
export class PendingsPageModule {}
