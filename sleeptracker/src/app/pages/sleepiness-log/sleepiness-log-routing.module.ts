import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SleepinessLogPage } from './sleepiness-log.page';

const routes: Routes = [
  {
    path: '',
    component: SleepinessLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SleepinessLogPageRoutingModule {}
