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
  public maxCurMonthSleep: number = 0;
  public minCurMonthSleep: number = 0;
  public avgCurMonthSleep: number = 0;


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

  private prepareSleepData() {
    let next_log;
    let day = this.curMonthSleepingData[0].getLoggedAt().getDate();
    let total_hours = 0;
    let days = 0;
    this.maxCurMonthSleep = 0;
    this.minCurMonthSleep = 24;
    let day_total = 0;
    for (let i = 0; i < this.sleepDataCount; i++) {
      next_log = this.curMonthSleepingData[i];
      if (next_log.getLoggedAt().getDate() != day) {    // new day; log the total hours of sleep of the day and reset values
        this.SleepingGraphData?.labels?.push(day);
        this.SleepingGraphData.datasets[0].data.push(day_total);
        total_hours += day_total;
        days += 1;
        if (day_total > this.maxCurMonthSleep) {
          this.maxCurMonthSleep = day_total;
        }
        if (day_total < this.minCurMonthSleep) {
          this.minCurMonthSleep = day_total;
        }
        day = next_log.getLoggedAt().getDate();
        day_total = 0;
      }
      day_total += ((next_log.getSleepEnd().getTime() - next_log.getSleepStart().getTime())/ (1000*60*60));
    }
    this.SleepingGraphData?.labels?.push(day);
    this.SleepingGraphData.datasets[0].data.push(day_total);
    total_hours += day_total;
    days += 1;
    this.avgCurMonthSleep = total_hours / days;
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

  // Get the average amount of sleep per day each month
  // Display which day of the week has the most and the least sleep?
  public sleepAnalysis(): string {
    return "In the past month, on average you have slept " + this.avgCurMonthSleep.toString() + " hours a day. The maximum amount of sleep you got was " + this.maxCurMonthSleep.toString() + " hours and the minimum amount of sleep you got was " + this.minCurMonthSleep.toString() + " hours.";
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


