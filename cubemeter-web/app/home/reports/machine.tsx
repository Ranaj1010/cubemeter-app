import { IMeterReading } from "@/models/meter-reading";
import { IMeterReadingBatch } from "@/models/meter-reading-batch";
import { GET, POST } from "@/utilities/http-services";
import { Machine, assign } from "xstate";

interface IContextProps {
	data: IMeterReading[];
	batches: IMeterReadingBatch[];
	endpoint: string;
	abortController: AbortController;
	errorMessage: string;
	payload: any;
}

interface IStates {
	states: {
		idle: {};
		generateMeterReading: {
			states: {
				generating: {};
				success: {};
				failed: {};
			};
		};
		fetchingMeterReadingBatches: {
			states: {
				fetching: {};
				failed: {};
			};
		};
		fetchingMeterReadingData: {
			states: {
				fetching: {};
				failed: {};
			};
		};
	};
}

type ITypes =
	| { type: "FETCH_METER_READING" }
	| { type: "GOTO_IDLE" }
	| { type: "GENERATE_METER_READING" }
	| { type: "FETCH_METER_READING_BATCHES" }
	| { type: "RETRY" }
	| { type: "CANCEL" };

const ReportsMachine = Machine<IContextProps, IStates, ITypes>({
	id: "reportsMachine",
	context: {
		batches: [],
		data: [],
		endpoint: "/api/v1/reports",
		abortController: new AbortController(),
		errorMessage: "",
		payload: {},
	},
	initial: "fetchingMeterReadingBatches",
	states: {
		idle: {
			on: {
				FETCH_METER_READING: "fetchingMeterReadingData",
				FETCH_METER_READING_BATCHES: "fetchingMeterReadingBatches",
				GENERATE_METER_READING: "generateMeterReading",
			},
		},
		generateMeterReading: {
			initial: "generating",
			states: {
				generating: {
					invoke: {
						src: async (context) =>
							await POST({
								endpoint: context.endpoint + "/generate-readings",
								abortSignal: context.abortController.signal,
								body: context.payload,
							}),
						onDone: {
							target: "success",
							actions: assign({
								data: (context, event) => event.data.data.data,
							}),
						},
						onError: "#reportsMachine.generateMeterReading.failed",
					},
				},
				success: {
					on: {
						FETCH_METER_READING_BATCHES: "#reportsMachine.fetchingMeterReadingBatches",
					},
				},
				failed: {},
			},
		},
		fetchingMeterReadingBatches: {
			initial: "fetching",
			states: {
				fetching: {
					invoke: {
						src: async (context) =>
							await GET({ endpoint: context.endpoint + "/meter-reading-batches", abortSignal: context.abortController.signal }),
						onDone: {
							target: "#reportsMachine.idle",
							actions: assign({
								batches: (context, event) => event.data.data.meterReadingBatches,
							}),
						},
						onError: "#reportsMachine.fetchingMeterReadingBatches.failed",
					},
				},
				failed: {},
			},
		},
		fetchingMeterReadingData: {
			initial: "fetching",
			states: {
				fetching: {
					invoke: {
						src: async (context) =>
							await POST({
								endpoint: context.endpoint + "/generate-readings",
								abortSignal: context.abortController.signal,
								body: context.payload,
							}),
						onDone: {
							target: "#reportsMachine.idle",
							actions: assign({
								data: (context, event) => event.data.data.data,
							}),
						},
						onError: "#reportsMachine.fetchingMeterReadingData.failed",
					},
				},
				failed: {},
			},
		},
	},
});

export default ReportsMachine;
