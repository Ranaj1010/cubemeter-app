import { IMeterReading } from "@/models/meter-reading";
import { POST } from "@/utilities/http-services";
import { Machine, assign } from "xstate";

interface IContextProps {
	data: IMeterReading[];
	endpoint: string;
	abortController: AbortController;
	errorMessage: string;
	payload: any;
}

interface IStates {
	states: {
		idle: {};
		fetchingMeterReadingData: {
			states: {
				fetching: {};
				failed: {};
			};
		};
	};
}

type ITypes = { type: "FETCH_METER_READING" } | { type: "RETRY" } | { type: "CANCEL" };

const ReportsMachine = Machine<IContextProps, IStates, ITypes>({
	id: "reportsMachine",
	context: {
		data: [],
		endpoint: "/api/v1/reports",
		abortController: new AbortController(),
		errorMessage: "",
		payload: {},
	},
	initial: "fetchingMeterReadingData",
	states: {
		idle: {
			on: {
				FETCH_METER_READING: "fetchingMeterReadingData",
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
