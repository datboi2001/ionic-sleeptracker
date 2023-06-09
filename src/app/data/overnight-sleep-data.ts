import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}
	// Getters
	getSleepStart():Date { return this.sleepStart; }
	getSleepEnd():Date { return this.sleepEnd; }
	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;

		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
		return this.sleepStart.toLocaleDateString('en-US', {dateStyle: 'medium' });
	}

	override toJson() {
		return {
			...super.toJson(),
			sleepStart: this.sleepStart.toISOString(),
			sleepEnd: this.sleepEnd.toISOString(),
		}
	}
}
