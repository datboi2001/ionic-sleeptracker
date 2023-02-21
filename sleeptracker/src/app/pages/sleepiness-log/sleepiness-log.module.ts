import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SleepinessLogPageRoutingModule } from './sleepiness-log-routing.module';

import { SleepinessLogPage } from './sleepiness-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SleepinessLogPageRoutingModule
  ],
  declarations: [SleepinessLogPage]
})
export class SleepinessLogPageModule {}
