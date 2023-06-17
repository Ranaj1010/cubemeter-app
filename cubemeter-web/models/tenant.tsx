import { IBaseModel } from "./base";
import IPlace from "./place";

interface ITenant extends IBaseModel {
	name: string;
	placeId: number;
	unitId: number;
	buildingNumber: string;
	serialNumber: string;
	dateRegistered: Date;
	gateway: string;
	remarks: string;
	place?: IPlace;
}

export default ITenant;
