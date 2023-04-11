import ITenant from "@/models/tenant";
import { DELETE, GET } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	data: ITenant[];
	selectedData?: ITenant;
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

type ITypes = { type: "FETCH" } | { type: "RETRY" } | { type: "CANCEL" } | { type: "DELETE"; place: ITenant } | { type: "DELETE_START" };

const TenantMachine = Machine<IContextProps, IStates, ITypes>({
	id: "tenantMachine",
	initial: "fetchingData",
	context: {
		data: [],
		endpoint: "/tenant",
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
							target: "#tenantMachine.idle",
							actions: assign({
								data: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#tenantMachine.fetchingData.failed",
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
							target: "#tenantMachine.idle",
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
						FETCH: "#tenantMachine.fetchingData",
					},
				},
				failed: {
					on: {
						RETRY: "deleting",
						CANCEL: {
							target: "#tenantMachine.idle",
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

export default TenantMachine;
