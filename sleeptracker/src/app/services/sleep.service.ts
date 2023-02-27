import { Injectable } from '@angular/core';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root',
})
export class SleepService {
  private static LoadData: boolean = true;
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  constructor() {
    if (SleepService.LoadData) {
      this.loadDataFromStorage();
      SleepService.LoadData = false;
    }
  }
  // Load data from Capacitor storage
  public setLoadData(loadData: boolean) {
    SleepService.LoadData = loadData;
  }

  private async loadKeyFromStorage(key: string): Promise<any[] | null> {
    try {
      const { value } = await Preferences.get({ key: key });
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (err) {
      console.error('Unable to get value for key: ' + key, err);
      return null;
    }
  }

  // Load data from Capacitor storage on startup
  private async loadDataFromStorage(): Promise<void> {
    const overnightData = await this.loadKeyFromStorage('overnightData');
    if (overnightData) {
      overnightData.forEach((element) => {
        const sleepStart = new Date(element.sleepStart);
        const sleepEnd = new Date(element.sleepEnd);
        SleepService.AllOvernightData.push(
          new OvernightSleepData(sleepStart, sleepEnd)
        );
      });
	  // Sort by sleepStart date
    }

    const sleepinessData = await this.loadKeyFromStorage('sleepinessData');
    if (sleepinessData) {
      sleepinessData.forEach((element) => {
        const sleepDate = new Date(element.loggedAt);
        SleepService.AllSleepinessData.push(
          new StanfordSleepinessData(element.loggedValue, sleepDate)
        );
      });
    }
  }

  public async saveDataToStorage(key: string, value = ''): Promise<void> {
    try {
      switch (key) {
        case 'overnightData':
          await Preferences.set({
            key: key,
            value: JSON.stringify(SleepService.AllOvernightData),
          });
          break;
        case 'sleepinessData':
          await Preferences.set({
            key: key,
            value: JSON.stringify(SleepService.AllSleepinessData),
          });
          break;

        default:
          await Preferences.set({
            key: key,
            value: value,
          });
      }
    } catch (err) {
      console.error('Unable to save value for key: ' + key, err);
    }
  }

  public async logOvernightData(sleepData: OvernightSleepData) {
    SleepService.AllOvernightData.push(sleepData);
    await this.saveDataToStorage('overnightData');
  }

  public async logSleepinessData(sleepData: StanfordSleepinessData) {
    SleepService.AllSleepinessData.push(sleepData);
    await this.saveDataToStorage('sleepinessData');
  }
}
