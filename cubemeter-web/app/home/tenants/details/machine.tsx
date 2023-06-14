import IMeter from "@/models/meter";
import ITenant from "@/models/tenant";
import { GET } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	id?: string;
	payload?: ITenant;
	hasError: boolean;
	errorMessage: string;
	abortController: AbortController;
	endpoint: string;
	meters: IMeter[];
}

interface IStates {
	states: {
		idle: {};
		retrieveDataById: {};
		getMeters: {};
		generateReport: {};
		error: {};
	};
}

type ITypes =
	| { type: "SUBMIT"; payload: ITenant }
	| { type: "CANCEL" }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "ALLOW_NEXT"; value: boolean }
	| { type: "ALLOW_SUBMIT"; value: boolean }
	| { type: "RETRIEVE_DATA"; id: string };

const TenantDetails = Machine<IContextProps, IStates, ITypes>({
	id: "tenantDetailsMachine",
	initial: "idle",
	context: {
		endpoint: "/api/v1/tenant",
		errorMessage: "",
		hasError: false,
		abortController: new AbortController(),
		meters: [],
	},
	states: {
		idle: {
			on: {
				RETRIEVE_DATA: {
					target: "retrieveDataById",
					actions: assign({
						id: (context, event) => event.id,
					}),
				},
			},
		},
		retrieveDataById: {
			invoke: {
				src: (context) => GET({ endpoint: context.endpoint + `/${context.id}`, abortSignal: context.abortController.signal }),
				onDone: {
					target: "#tenantDetailsMachine.getMeters",
					actions: assign({
						payload: (_, event) => event.data.data.data,
					}),
				},
				onError: {
					target: "#tenantDetailsMachine.error",
					actions: assign({
						hasError: (_, e) => true,
						errorMessage: (_, event) => {
							const error: AxiosError = event.data;
							switch (error.response?.status) {
								case 404:
									return `Cannot find 'Tenant' in our record. Please try again later.`;

								default:
									return `${error.message}. Please try again later.`;
							}
						},
					}),
				},
			},
		},
		getMeters: {
			invoke: {
				src: (context) => GET({ endpoint: `/api/v1/meter/tenant/${context.id}`, abortSignal: context.abortController.signal }),
				onDone: {
					target: "#tenantDetailsMachine.idle",
					actions: assign({
						meters: (_, event) => event.data.data.data,
					}),
				},
				onError: {
					target: "#tenantDetailsMachine.error",
					actions: assign({
						hasError: (_, e) => true,
						errorMessage: (_, event) => {
							const error: AxiosError = event.data;
							switch (error.response?.status) {
								case 404:
									return `Cannot find 'Tenant' in our record. Please try again later.`;

								default:
									return `${error.message}. Please try again later.`;
							}
						},
					}),
				},
			},
		},
		generateReport: {},
		error: {},
	},
});

export default TenantDetails;
