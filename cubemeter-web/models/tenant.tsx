import { IBaseModel } from "./base";

interface ITenant extends IBaseModel {
	name: string;
	placeId: number;
	unitId: number;
	serialNumber: string;
	dateRegistered: Date;
	gateway: string;
	remarks: string;
}

export default ITenant;
