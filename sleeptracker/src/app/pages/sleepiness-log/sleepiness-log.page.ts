import { Component, OnInit } from '@angular/core';
import {StanfordSleepinessData} from "../../data/stanford-sleepiness-data";
import { getIsoLocalTime } from 'src/app/util/util';
import { SleepService } from 'src/app/services/sleep.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-sleepiness-log',
  templateUrl: './sleepiness-log.page.html',
  styleUrls: ['./sleepiness-log.page.scss'],
})
export class SleepinessLogPage implements OnInit {

  scaleValues = StanfordSleepinessData.ScaleValues;
  private getIsoLocalTime = getIsoLocalTime;
  public loggedValue: number = 1;
  public loggedDate: string = '';
  constructor(private readonly sleepService: SleepService, private alertController: AlertController) { }

  ngOnInit() {
    this.loggedDate = this.getIsoLocalTime();
  }

  async onSubmit(){
    const loggedDate = new Date(this.loggedDate);
    const curDate = new Date(); 
    const loggedDateSeconds = loggedDate.getTime();
    // Disallow logging sleepiness data in the future    

    if (loggedDate > curDate){
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'You cannot log sleepiness data for the future.',
        buttons: ['My bad!'],
      });
      await alert.present();
      return;
    }

    // Check that loggedDate does not overlap with any existing sleep data
    for (const sleepinessData of SleepService.AllSleepinessData){
      // Only allow users to log sleepiness data once per hour
      const curLoggedDate = sleepinessData.getLoggedAt().getTime();
      if (curLoggedDate <= loggedDateSeconds && loggedDateSeconds <= curLoggedDate + 3600000){
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'You have already logged sleepiness data for this hour.',
          buttons: ['My bad!'],
        });
        await alert.present();
        return;
      } 
    }    


    for (const overnightData of SleepService.AllOvernightData) {
      const curSleepStart = overnightData.getSleepStart().getTime();
      const curSleepEnd = overnightData.getSleepEnd().getTime();
      if (curSleepStart <= loggedDateSeconds && loggedDateSeconds <= curSleepEnd) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'How can you log sleepiness data when you are asleep?',
          buttons: ['My bad!'],
        });
        await alert.present();
        return;
      }
    }
    await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.loggedValue, loggedDate));

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your sleepiness data has been logged.',
      buttons: ['Thanks'],
    });
    await alert.present();
  }

}
