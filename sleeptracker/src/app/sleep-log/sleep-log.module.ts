import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SleepLogPageRoutingModule } from './sleep-log-routing.module';

import { SleepLogPage } from './sleep-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SleepLogPageRoutingModule
  ],
  declarations: [SleepLogPage]
})
export class SleepLogPageModule {}
