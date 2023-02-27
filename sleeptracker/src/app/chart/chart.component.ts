import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: [ './chart.component.scss' ]
})
export class ChartComponent implements  OnInit{

  constructor() {
    Chart.register(...registerables)
  }

  ngOnInit() {
  }

  @Input() public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  @Input() public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: { position: 'left',
        grid: {
          color: 'rgb(205,210,222)',
        },
        ticks: {
          color: '#FFF'
        }
      },
      x:{
        ticks: {
          color: '#FFF'
        }

      }
    },

    plugins: {
      legend: { display: true,
        labels: {
          color: '#FFF'

        }
      },
    }
  };

  @Input() public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
}
