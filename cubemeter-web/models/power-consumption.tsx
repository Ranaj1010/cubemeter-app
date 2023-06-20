import ITenant from "./tenant";

export interface IPowerConsumption {
	tenant: ITenant;
	powerConsumption: number;
}
