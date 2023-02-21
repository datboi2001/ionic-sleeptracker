import { Component, OnInit } from '@angular/core';
import {StanfordSleepinessData} from "../../data/stanford-sleepiness-data";
@Component({
  selector: 'app-sleepiness-log',
  templateUrl: './sleepiness-log.page.html',
  styleUrls: ['./sleepiness-log.page.scss'],
})
export class SleepinessLogPage implements OnInit {

  scaleValues = StanfordSleepinessData.ScaleValues;
  public loggedValue: number = 1;
  public loggedDate: string = "";
  constructor() { }

  ngOnInit() {
  }

  onClick(){
    console.log("Logged value: " + this.loggedValue);
    console.log("Logged date: " + this.loggedDate);
  }

}
