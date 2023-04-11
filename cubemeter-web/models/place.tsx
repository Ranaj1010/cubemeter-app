import { IBaseModel } from "./base";

interface IPlace extends IBaseModel {
	name: string;
	timezone: string;
	region: string;
	country: string;
	city: string;
	address: string;
	currency: string;
	serialNumber: string;
	billingDay: number;
	sortNumber: number;
	latitude: number;
	longitude: number;
}

export default IPlace;
