import { ICustomMeter } from "@/models/meter";
import { IPowerConsumption } from "@/models/power-consumption";
import { ITenantLoad } from "@/models/tenant-load";
import { GET } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	powerConsumptions: IPowerConsumption[];
	tenantLoads: ITenantLoad[];
	endpoint: string;
	abortController: AbortController;
	errorMessage: string;
}

interface IStates {
	states: {
		idle: {};
		fetchingData: {
			states: {
				fetchingPowerConsumptions: {};
				fetchingTenantLoads: {};
			};
		};
		failed: {};
	};
}

type ITypes = { type: "FETCH" } | { type: "RETRY" } | { type: "CANCEL" } | { type: "DELETE"; meter: ICustomMeter } | { type: "DELETE_START" };

const DashboardMachine = Machine<IContextProps, IStates, ITypes>({
	id: "dashboardMachine",
	initial: "fetchingData",
	context: {
		powerConsumptions: [],
		tenantLoads: [],
		endpoint: "/api/v1/dashboard",
		errorMessage: "",
		abortController: new AbortController(),
	},
	states: {
		idle: {
			on: {
				FETCH: "fetchingData",
			},
		},
		fetchingData: {
			initial: "fetchingPowerConsumptions",
			states: {
				fetchingPowerConsumptions: {
					invoke: {
						src: async (context) =>
							await GET({ endpoint: context.endpoint + "/power-consumption", abortSignal: context.abortController.signal }),
						onDone: {
							target: "fetchingTenantLoads",
							actions: assign({
								powerConsumptions: (context, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#dashboardMachine.failed",
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
				fetchingTenantLoads: {
					invoke: {
						src: async (context) =>
							await GET({ endpoint: context.endpoint + "/tenant-load", abortSignal: context.abortController.signal }),
						onDone: {
							target: "#dashboardMachine.idle",
							actions: assign({
								tenantLoads: (context, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#dashboardMachine.failed",
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
			},
		},
		failed: {},
	},
});

export default DashboardMachine;
