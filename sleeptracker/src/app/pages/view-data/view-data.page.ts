import {Component, OnInit} from '@angular/core';
import {OvernightSleepData} from 'src/app/data/overnight-sleep-data';
import {StanfordSleepinessData} from 'src/app/data/stanford-sleepiness-data';
import {SleepService} from '../../services/sleep.service';
import {ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.page.html',
  styleUrls: ['./view-data.page.scss'],
})
export class ViewDataPage implements OnInit {


  public intlApi = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  curMonthSleepingData: OvernightSleepData[] = [];
  curDate = new Date();
  curMonthSleepinessData: StanfordSleepinessData[] = [];
  SleepingGraphData: ChartConfiguration['data'] = {
    datasets: [{
      label: `Sleeping Data Cycle in ${this.curDate.toLocaleString('default', {month: 'long'})}`,
      data: [],
      fill: true,
      borderColor: 'rgb(32,100,226)',
      pointBackgroundColor: '#FFF',
      tension: 0.1
    }],
    labels: [],
  };
  sleepinessGraphData: ChartConfiguration['data'] = {
    datasets: [{
      label: `Average daily sleepiness scale in ${this.curDate.toLocaleString('default', {month: 'long'})}`,
      data: [],
      backgroundColor: 'rgba(250,250,250,0.5)',
      fill: {
        target: 'origin',
        above: 'rgba(255,255,255,0.5)',
      },
      borderColor: 'rgb(10,12,12)',
      tension: 0.1,
      pointBackgroundColor: '#FFF'
    }],
    labels: [],
  };
  public sleepDataCount: number = 0;
  public sleepinessDataCount: number = 0;

  constructor(private sleepService: SleepService) {
    this.addDataToCurMonthData();
    this.prepareSleepinessData();
  }


  private addDataToCurMonthData() {
    const curMonth = new Date().getMonth();

    SleepService.AllOvernightData.forEach((element) => {
      if (element.getSleepStart().getMonth() === curMonth) {
        this.curMonthSleepingData.push(element);
        this.sleepDataCount += 1;
      }
    });

    SleepService.AllSleepinessData.forEach((element) => {
      if (element.getLoggedAt().getMonth() === curMonth) {
        this.curMonthSleepinessData.push(element);
        this.sleepinessDataCount += 1;
      }
    });
    // Sort by date
    this.curMonthSleepingData.sort((a, b) => {
      return a.getSleepStart().getTime() - b.getSleepStart().getTime();
    });

    this.curMonthSleepinessData.sort((a, b) => {
      return a.getLoggedAt().getTime() - b.getLoggedAt().getTime();
    })
  }

  private prepareSleepinessData() {
    let next_log;
    let day = this.curMonthSleepinessData[0].getLoggedAt().getDate();
    let day_total = 0;
    let day_entries = 0;
    for (let i = 0; i < this.sleepinessDataCount; i++) {
      next_log = this.curMonthSleepinessData[i];
      if (next_log.getLoggedAt().getDate() != day) {    // new day; log the average sleepiness of the day and reset values
        this.sleepinessGraphData?.labels?.push(day);
        this.sleepinessGraphData.datasets[0].data.push(day_total / day_entries);
        day = next_log.getLoggedAt().getDate();
        day_total = 0;
        day_entries = 0;
      }
      day_total += next_log.getLoggedValue();
      day_entries += 1;
    }
    this.sleepinessGraphData?.labels?.push(day);
    this.sleepinessGraphData.datasets[0].data.push(day_total / day_entries);
  }

  ngOnInit() {
  }

  // Get the first 3 sleepiness logs (beginnning) of the month and the last 3 sleepiness logs of the month (end)
  // If the avg sleepiness of beginning is lower than then end, sleepiness scale is trending downwards (vice versa if higher)
  // If +-0.25, [consistent], if between +-0.26 - 1, [trending slightly lower/higher], if between +-1 - 2 [trending lower/higher],
  // if greater than +- 2 [prominently lower/higher]
  public sleepinessAnalysis(): string {
    if (this.sleepinessDataCount < 6) {
      return "Not enough Data";
    }
    let first3_avg = this.curMonthSleepinessData.slice(0, 3).map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / 3;
    let last3_avg = this.curMonthSleepinessData.slice(this.sleepinessDataCount - 3, this.sleepinessDataCount).map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / 3;
    let difference = last3_avg - first3_avg;
    let sleepinesstrend;
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
    let monthly_avg = this.curMonthSleepinessData.map((item) => {
      return item.getLoggedValue();
    }).reduce((a, b) => a + b) / this.sleepinessDataCount;
    let sleep_rating;
    if (monthly_avg >= 4) {
      sleep_rating = "terrible this past month. Please get some more sleep.";
    } else if ((monthly_avg >= 2) && (monthly_avg < 4)) {
      sleep_rating = "fairly good this past month.";
    } else {
      sleep_rating = "great this past month! Keep it up!"
    }
    return "In the past month, you have logged " + this.sleepinessDataCount.toString() + " sleepiness logs. Your sleepiness is " + sleepinesstrend + "You have been sleeping " + sleep_rating;

  }

  ngOnDestroy(){
    this.sleepService.setLoadData(false);
  }

}


