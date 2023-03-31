import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';
import { SleepService } from 'src/app/services/sleep.service';
import { getIsoLocalTime } from 'src/app/util/util';
@Component({
  selector: 'app-sleep-log',
  templateUrl: './sleep-log.page.html',
  styleUrls: ['./sleep-log.page.scss'],
})
export class SleepLogPage implements OnInit {
  constructor(private readonly sleep_service: SleepService, private alertController: AlertController) {}
  // Get current time
  private getIsoLocalTime = getIsoLocalTime;
  public sleepLog = {
    start_date: this.getIsoLocalTime(),
    end_date: this.getIsoLocalTime(),
  };
  ngOnInit() {
  }

  async onSubmit() {

    const sleepStart = new Date(this.sleepLog.start_date);
    const sleepEnd = new Date(this.sleepLog.end_date);
    // Get UTC timestamps
    const sleepStartSeconds = sleepStart.getTime()
    const sleepEndSeconds = sleepEnd.getTime();

    const curDate = new Date();

    // Disallow logging sleep data in the future

    if (sleepStart > curDate || sleepEnd > curDate) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'You cannot log sleep data for the future.',
        buttons: ['My bad!'],
      });
      await alert.present();
      return;
    }
    // Handle invalid inputs
    if (sleepStart > sleepEnd) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Your sleep time is after your wake up time.',
        buttons: ['My bad!'],
      });
      await alert.present()
      return;
    }
    // Check that sleepStart and sleepEnd do not overlap with any existing sleep data
    for (const overnightData of SleepService.AllOvernightData) {
      const curSleepStart = overnightData.getSleepStart().getTime();
      const curSleepEnd = overnightData.getSleepEnd().getTime();
      if (Math.max(curSleepStart, sleepStartSeconds) <= Math.min(curSleepEnd, sleepEndSeconds)
      ) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Your sleep data overlaps with existing sleep data.',
          buttons: ['My bad!'],
        });
        await alert.present();
        return;
      }
    }

    // Add new sleep data
    await this.sleep_service.logOvernightData(
      new OvernightSleepData(sleepStart, sleepEnd)
    );

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your sleep data has been logged.',
      buttons: ['Thanks!'],
    });
    await alert.present();
  }
}
