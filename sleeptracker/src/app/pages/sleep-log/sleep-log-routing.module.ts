import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SleepLogPage } from './sleep-log.page';

const routes: Routes = [
  {
    path: '',
    component: SleepLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SleepLogPageRoutingModule {}
