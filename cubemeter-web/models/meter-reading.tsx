export type IMeterReading = {
	meterNo: string;
	reading: number;
	date: Date;
	time: Date;
	initial: string;
	building: string;
	tenantName: string;
	meterType: string;
	currentReading: string;
	previousReading: string;
	multi: string;
	currentConsumption: string;
	previousConsumption: string;
	percentageDifference: string;
};
