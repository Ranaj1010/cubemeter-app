import { ICustomMeter } from "@/models/meter";
import { DELETE, GET } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	data: ICustomMeter[];
	selectedData?: ICustomMeter;
	endpoint: string;
	abortController: AbortController;
	errorMessage: string;
}

interface IStates {
	states: {
		idle: {};
		fetchingData: {
			states: {
				fetching: {};
				failed: {};
			};
		};
		delete: {
			states: {
				prompt: {};
				deleting: {};
				success: {};
				failed: {};
			};
		};
	};
}

type ITypes = { type: "FETCH" } | { type: "RETRY" } | { type: "CANCEL" } | { type: "DELETE"; meter: ICustomMeter } | { type: "DELETE_START" };

const MeterMachine = Machine<IContextProps, IStates, ITypes>({
	id: "meterMachine",
	initial: "fetchingData",
	context: {
		data: [],
		endpoint: "/api/v1/meter",
		errorMessage: "",
		abortController: new AbortController(),
	},
	states: {
		idle: {
			on: {
				FETCH: "fetchingData",
				DELETE: {
					target: "delete",
					actions: assign({
						selectedData: (_, event) => event.meter,
					}),
				},
			},
		},
		fetchingData: {
			initial: "fetching",
			states: {
				fetching: {
					invoke: {
						src: (context) => GET({ endpoint: context.endpoint + "/with-kilowatthour", abortSignal: context.abortController.signal }),
						onDone: {
							target: "#meterMachine.idle",
							actions: assign({
								data: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#meterMachine.fetchingData.failed",
							actions: assign({
								errorMessage: (_, event) => {
									const error: AxiosError = event.data;
									switch (error.response?.status) {
										case 500:
											return `Server error. Please try again later.`;

										default:
											return `${error.message}. Please try again later.`;
									}
								},
							}),
						},
					},
				},
				failed: {
					on: {
						RETRY: "fetching",
					},
				},
			},
		},
		delete: {
			initial: "prompt",
			states: {
				prompt: {
					on: {
						DELETE_START: "deleting",
						CANCEL: {
							target: "#meterMachine.idle",
							actions: assign({
								selectedData: (_, event) => undefined,
							}),
						},
					},
				},
				deleting: {
					invoke: {
						src: (context) =>
							DELETE({ endpoint: context.endpoint + `/${context.selectedData?.id}`, abortSignal: context.abortController.signal }),
						onDone: "success",
						onError: {
							target: "failed",
							actions: assign({
								errorMessage: (_, event) => {
									const error: AxiosError = event.data;
									switch (error.response?.status) {
										case 500:
											return `Server error. Please try again later.`;

										default:
											return `${error.message}. Please try again later.`;
									}
								},
							}),
						},
					},
				},
				success: {
					on: {
						FETCH: "#meterMachine.fetchingData",
					},
				},
				failed: {
					on: {
						RETRY: "deleting",
						CANCEL: {
							target: "#meterMachine.idle",
							actions: assign({
								selectedData: (_, event) => undefined,
							}),
						},
					},
				},
			},
		},
	},
});

export default MeterMachine;
