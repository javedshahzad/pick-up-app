import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoStep1Page } from './photo-step1.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoStep1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoStep1PageRoutingModule {}
