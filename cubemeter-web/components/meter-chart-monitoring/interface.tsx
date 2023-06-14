import IMeter from "@/models/meter";
import { MqttClient } from "mqtt";

export interface IRawMeterReading {
	voltage: number;
	kilowatthour: number;
	kilowatt: number;
	current: number;
	timeStamp: Date;
}

export interface IContext {
	readings: IRawMeterReading[];
	historicalReadings: IRawMeterReading[];
	meter?: IMeter;
	mqttClient: MqttClient;
}

export interface IStates {
	states: {
		idle: {};
		connecting: {};
		connected: {
			states: {
				subscribing: {};
				subscribed: {};
				error: {};
			};
		};
		connectionFailed: {};
	};
}

export type ITypes =
	| { type: "UPDATE"; payload: IRawMeterReading }
	| { type: "CONNECT"; payload: IMeter }
	| { type: "DISCONNECT" }
	| { type: "RETRY" };
