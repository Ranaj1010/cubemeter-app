import mqtt from "mqtt";
import { Machine, assign } from "xstate";
import { IContext, IStates, ITypes } from "./interface";
const MeterChartMonitoringMachine = Machine<IContext, IStates, ITypes>({
	id: "meterChartMonitoringMachine",
	initial: "idle",
	context: {
		readings: [],
		historicalReadings: [],
		mqttClient: mqtt.connect("ws://5.189.132.25:8055", {
			protocol: "tcp",
		}),
	},
	onDone: {
		actions: [(context) => context.mqttClient.end()],
	},
	states: {
		idle: {
			on: {
				CONNECT: {
					target: "connecting",
					actions: assign({
						meter: (context, event) => event.payload,
					}),
				},
			},
		},
		connecting: {
			invoke: {
				src: async (context) =>
					context.mqttClient.on("connect", () => {
						return true;
					}),
				onDone: "connected",
				onError: "connectionFailed",
			},
		},
		connected: {
			initial: "subscribing",
			states: {
				subscribing: {
					invoke: {
						src: async (context) => {
							try {
								console.log(context.meter);
								context.mqttClient.subscribe(`${context.meter!.tenant?.gateway}/${context.meter!.tenant?.unitId}`);
							} catch (error) {
								console.log(error);
							}
							return true;
						},
						onDone: "subscribed",
						onError: {
							target: "error",
						},
					},
				},
				subscribed: {
					on: {
						UPDATE: {
							actions: assign({
								readings: (context, event) => {
									let temp = context.readings;

									if (temp.length == 10) {
										temp.shift();
									}

									if (
										!temp.find(
											(f) =>
												f.current == event.payload.current &&
												f.kilowatt == event.payload.kilowatt &&
												f.kilowatthour == event.payload.kilowatthour &&
												f.voltage == event.payload.voltage
										)
									) {
										temp.push(event.payload);
									}

									return temp;
								},
								historicalReadings: (context, event) => {
									let temp = context.readings;

									if (
										!temp.find(
											(f) =>
												f.current == event.payload.current &&
												f.kilowatt == event.payload.kilowatt &&
												f.kilowatthour == event.payload.kilowatthour &&
												f.voltage == event.payload.voltage
										)
									) {
										temp.push(event.payload);
									}

									return temp;
								},
							}),
						},
						DISCONNECT: {
							target: "#meterChartMonitoringMachine.idle",
							actions: [(context) => context.mqttClient.end()],
						},
					},
					onDone: {
						actions: [(context) => context.mqttClient.end()],
					},
				},
				error: {
					on: {
						RETRY: "#meterChartMonitoringMachine.connected.subscribing",
					},
				},
			},
		},
		connectionFailed: {
			on: {
				RETRY: "#meterChartMonitoringMachine.connecting",
			},
		},
	},
});

export default MeterChartMonitoringMachine;
