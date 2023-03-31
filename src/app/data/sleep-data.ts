import { nanoid } from 'nanoid';

export class SleepData {
	id:string;
	loggedAt:Date;

	constructor() {
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged entries the same).
		this.id = nanoid();
		this.loggedAt = new Date();
	}

	// Getters
	getId():string { return this.id; }
	getLoggedAt():Date { return this.loggedAt; }

	toJson() {
		return {
			id: this.id,
			loggedAt: this.loggedAt.toISOString(),
		} 
	}
	summaryString():string {
		return 'Unknown sleep data';
	}

	dateString():string {
		return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
