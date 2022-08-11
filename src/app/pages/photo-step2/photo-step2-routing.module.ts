import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoStep2Page } from './photo-step2.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoStep2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoStep2PageRoutingModule {}
