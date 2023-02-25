import { Component, OnInit } from '@angular/core';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';
import { StanfordSleepinessData } from 'src/app/data/stanford-sleepiness-data';
import { SleepService } from '../../services/sleep.service';
import { ChartConfiguration} from 'chart.js';
@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.page.html',
  styleUrls: ['./view-data.page.scss'],
})
export class ViewDataPage implements OnInit {

  private curMonthSleepingData: OvernightSleepData[] = [];
  private curMonthSleepinessData: StanfordSleepinessData[] = [];
  private SleepingGraphData: ChartConfiguration['data'] = {
    datasets: [{
      label: 'Sleeping Data Cycle in this month',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }],
    labels: [],
  };
  private SleepinessGraphData: ChartConfiguration['data'] = {
    datasets: [{
      label: 'Sleepiness Data in this month',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }],
    labels: [],
  };
  public SleepDataCount: number = 0;
  public SleepinessDataCount: number = 0;

  constructor() {
    this.addDataToCurMonthData();
    // this.prepareSleepinessData();
  }


  private addDataToCurMonthData() {
    const curMonth = new Date().getMonth();

    SleepService.AllOvernightData.forEach((element) => {
      if (element.getSleepStart().getMonth() === curMonth) {
        this.curMonthSleepingData.push(element);
        this.SleepDataCount += 1;
      }
    });

    SleepService.AllSleepinessData.forEach((element) => {
      if (element.getLoggedAt().getMonth() === curMonth) {
        this.curMonthSleepinessData.push(element);
        this.SleepinessDataCount += 1;
      }
    });

  }

  private prepareSleepinessData() {
    var next_log;
    var day = this.curMonthSleepinessData[0].getLoggedAt().getDate();
    var day_total = 0;
    var day_entries = 0;
    for (var i = 0; i < this.SleepinessDataCount; i++) {
      next_log = this.curMonthSleepinessData[i];
      if (next_log.getLoggedAt().getDate() != day) {    // new day; log the average sleepiness of the day and reset values
        this.SleepinessGraphData?.labels?.push(day);
        this.SleepinessGraphData.datasets[0].data.push(day_total / day_entries);
        day = next_log.getLoggedAt().getDate();
        day_total = 0;
        day_entries = 0;
      }
      day_total += next_log.getLoggedValue();
      day_entries += 1;
    }
  }

  ngOnInit() {
  }

  // Get the first 3 sleepiness logs (beginnning) of the month and the last 3 sleepiness logs of the month (end)
  // If the avg sleepiness of beginning is lower than then end, sleepiness scale is trending downwards (vice versa if higher)
  // If +-0.25, [consistent], if between +-0.26 - 1, [trending slightly lower/higher], if between +-1 - 2 [trending lower/higher],
  // if greater than +- 2 [prominently lower/higher]
  public sleepinessAnalysis(): string {
    if (this.SleepinessDataCount < 6) {
      return "Not enough Data";
    }
    var first3_avg = this.curMonthSleepinessData.slice(0, 3).map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / 3;
    var last3_avg = this.curMonthSleepinessData.slice(this.SleepinessDataCount - 3, this.SleepinessDataCount).map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / 3;
    var difference = last3_avg - first3_avg;
    var sleepinesstrend;
    if (difference > 0) {   // higher sleepiness
      if (difference <= 0.25) {
        sleepinesstrend = "consistent. ";
      } else if ((difference > 0.25) && (difference <= 1)) {
        sleepinesstrend = "trending slightly higher. ";
      } else if ((difference > 1) && (difference <= 2)) {
        sleepinesstrend = "trending higher. ";
      } else {
        sleepinesstrend = "trending prominently higher! ";
      }
    } else {                // lower sleepiness
      if (difference >= -0.25) {
        sleepinesstrend = "consistent. ";
      } else if ((difference < -0.25) && (difference >= -1)) {
        sleepinesstrend = "trending slightly lower. ";
      } else if ((difference < -1) && (difference >= -2)) {
        sleepinesstrend = "trending lower. ";
      } else {
        sleepinesstrend = "trending prominently lower! ";
      }
    }
    var monthly_avg = this.curMonthSleepinessData.map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / this.SleepinessDataCount;
    var sleep_rating;
    if (monthly_avg >= 4) {
      sleep_rating = "terrible this past month. Please get some more sleep.";
    } else if ((monthly_avg >=2) && (monthly_avg < 4)) {
      sleep_rating = "fairly good this past month.";
    } else {
      sleep_rating = "great this past month! Keep it up!"
    }
    return "In the past month, you have logged " + this.SleepinessDataCount.toString + " sleepiness logs. Your sleepiness is " + sleepinesstrend + "You have been sleeping " + sleep_rating;
  }

}


