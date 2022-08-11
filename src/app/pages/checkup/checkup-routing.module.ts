import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckupPage } from './checkup.page';

const routes: Routes = [
  {
    path: '',
    component: CheckupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckupPageRoutingModule {}
