import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDataPageRoutingModule } from './view-data-routing.module';
import {NgChartsModule} from 'ng2-charts';
import { ViewDataPage } from './view-data.page';
import { ChartComponent } from '../../chart/chart.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDataPageRoutingModule,
    NgChartsModule
  ],
  declarations: [ViewDataPage, ChartComponent]
})
export class ViewDataPageModule {}
