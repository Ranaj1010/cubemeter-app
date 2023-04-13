import IMeter from "@/models/meter";
import { DELETE, GET } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	data: IMeter[];
	selectedData?: IMeter;
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

type ITypes = { type: "FETCH" } | { type: "RETRY" } | { type: "CANCEL" } | { type: "DELETE"; place: IMeter } | { type: "DELETE_START" };

const PlacesMachine = Machine<IContextProps, IStates, ITypes>({
	id: "placesMachine",
	initial: "fetchingData",
	context: {
		data: [],
		endpoint: "/place",
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
						selectedData: (_, event) => event.place,
					}),
				},
			},
		},
		fetchingData: {
			initial: "fetching",
			states: {
				fetching: {
					invoke: {
						src: (context) => GET({ endpoint: context.endpoint, abortSignal: context.abortController.signal }),
						onDone: {
							target: "#placesMachine.idle",
							actions: assign({
								data: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#placesMachine.fetchingData.failed",
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
							target: "#placesMachine.idle",
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
						FETCH: "#placesMachine.fetchingData",
					},
				},
				failed: {
					on: {
						RETRY: "deleting",
						CANCEL: {
							target: "#placesMachine.idle",
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

export default PlacesMachine;
