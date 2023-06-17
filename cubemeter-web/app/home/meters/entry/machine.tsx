import { IEntryModeEnum } from "@/components/form-controls";
import IMeter from "@/models/meter";
import ITenant from "@/models/tenant";
import { GET, POST, PUT } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	id?: string;
	payload?: IMeter;
	hasError: boolean;
	errorMessage: string;
	hasIncompleteFields: boolean;
	abortController: AbortController;
	endpoint: string;
	mode: IEntryModeEnum;
	tenants: ITenant[];
}

interface IStates {
	states: {
		create: {
			states: {
				getTenants: {};
				encoding: {};
				creating: {};
				cancelling: {};
				succeeded: {};
				failed: {};
				error: {};
			};
		};
		update: {
			states: {
				getTenants: {};
				retrieveDataById: {};
				encoding: {};
				updating: {};
				cancelling: {};
				succeeded: {};
				failed: {};
				error: {};
			};
		};
	};
}

type ITypes =
	| { type: "SUBMIT"; payload: IMeter }
	| { type: "CANCEL" }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "ALLOW_NEXT"; value: boolean }
	| { type: "ALLOW_SUBMIT"; value: boolean }
	| { type: "CHANGE_MODE" }
	| { type: "RETRIEVE_DATA"; id: string };

const MeterEntryMachine = Machine<IContextProps, IStates, ITypes>({
	/** @xstate-layout N4IgpgJg5mDOIC5QEMIQAoBtkGMwFlcALASwDswA6MMnAewnKgGIBBAEXYG0AGAXUSgADnVgkALiTplBIAB6IATIoAclACyKAjCoBsAdgCsugJzrdPPQBoQAT0QBmS5X08n+k5cUmHi9QF9-G1QMbDxCHFIKaloGJjYAGQSAeQB1AH0AOQBRAA0AFV4BJBARMUlpWQUEQx5KFVUtdR4-BzaHTRt7BG91SkN9FR59Dy0fE31FQOC0LFwCYnIqGnpGMhZWJLT0gGUAVQAhfABJQv5ZMokpGRLq9S1KEyfnl+frO0QxtXVnwwddZRtEyKBzTEAhObhRbRFZxdbMABK2XyCIAmkULqIrpVbkpVBptHojKZzJZdF0lIY1Io3MN1JoVKNDGCIWEFpEljFVvEAMKsTI87IJDElS4VG6garKb6EgzGMwWd7dZp9QZaGltDxPNyBIIgMgMOCyVnzCJRMCY8rXKqIAC0ukoPCdzpdzqaFIQ9sdrp9Tv0LNmbLNnNhaygluxEvkiFcjq0xgcIza6sMEw9DhMhkoumMNOUWl06kMhi0AdCpuhVBwACcwMhJOsI+KbQgHCWXDmqeZ1CoGh51Om-C5NFoHCp1YynSoy5D2ebKDhkLQwJhMEwm9bca32-pOypu73FP2Pc0s40NYnnjq9SaoRzorAAK44PCQSAbnGSxC6ByPXSM4wmjHQtFGLD0mjqV1mgBcc3GZG9Awre8qAAM2QEhMHfUUsWbLcVF-RNah4AxPHUXdzA9ccNFeZo9FMRNdX8IA */
	id: "meterEntryMachine",
	initial: "create",
	context: {
		mode: IEntryModeEnum.create,
		endpoint: "/api/v1/meter",
		errorMessage: "",
		hasError: false,
		hasIncompleteFields: true,
		abortController: new AbortController(),
		tenants: [],
	},
	states: {
		create: {
			initial: "getTenants",
			on: {
				CHANGE_MODE: "#meterEntryMachine.update",
			},
			states: {
				getTenants: {
					invoke: {
						src: (context) => GET({ endpoint: "/api/v1/tenant", abortSignal: context.abortController.signal }),
						onDone: {
							target: "#meterEntryMachine.create.encoding",
							actions: assign({
								tenants: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#meterEntryMachine.create.error",
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
				encoding: {
					on: {
						CHANGE_MODE: "#meterEntryMachine.update",
						SUBMIT: {
							target: "#meterEntryMachine.create.creating",
							actions: assign({
								payload: (context, event) => event.payload,
							}),
						},
						RETRY: "#meterEntryMachine.create.creating",
					},
				},
				creating: {
					invoke: {
						src: (context) => POST({ endpoint: context.endpoint, abortSignal: context.abortController.signal, body: context.payload }),
						onDone: "#meterEntryMachine.create.succeeded",
						onError: {
							target: "#meterEntryMachine.create.failed",
							actions: assign({
								hasError: (_, e) => true,
								errorMessage: (_, event) => {
									const error: AxiosError = event.data;
									return `${error.message}. Please try again later.`;
								},
							}),
						},
					},
					on: {
						CANCEL: "cancelling",
					},
				},
				cancelling: {
					invoke: {
						src: (context, event) => (callback, onReceive) => {
							// This will call the abort controller to abort the request when it hits 500 milliseconds;
							const id = setTimeout(() => context.abortController.abort(), 500);
							// Perform cancel
							return () => clearTimeout(id);
						},
						onDone: "#meterEntryMachine.create.encoding",
						onError: "#meterEntryMachine.create.failed",
					},
				},
				succeeded: {
					on: {
						RESET: {
							target: "#meterEntryMachine.create.encoding",
							actions: assign({
								payload: (_, e) => undefined,
								errorMessage: (_, e) => "",
								hasError: (_, e) => false,
								hasIncompleteFields: (_, e) => false,
							}),
						},
					},
				},
				failed: {
					on: {
						RETRY: "#meterEntryMachine.create.creating",
					},
				},
				error: {
					on: {
						RETRY: "#meterEntryMachine.update.retrieveDataById",
						CHANGE_MODE: "#meterEntryMachine.create",
					},
				},
			},
		},
		update: {
			initial: "getTenants",
			on: {
				RETRIEVE_DATA: {
					target: "#meterEntryMachine.update.getTenants",
					actions: assign({
						id: (_, event) => event.id,
					}),
				},
			},
			states: {
				getTenants: {
					invoke: {
						src: (context) => GET({ endpoint: "/api/v1/tenant", abortSignal: context.abortController.signal }),
						onDone: {
							target: "#meterEntryMachine.update.retrieveDataById",
							actions: assign({
								tenants: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#meterEntryMachine.update.error",
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
				retrieveDataById: {
					invoke: {
						src: (context) => GET({ endpoint: context.endpoint + `/${context.id}`, abortSignal: context.abortController.signal }),
						onDone: {
							target: "#meterEntryMachine.update.encoding",
							actions: assign({
								payload: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#meterEntryMachine.update.error",
							actions: assign({
								hasError: (_, e) => true,
								errorMessage: (_, event) => {
									const error: AxiosError = event.data;
									switch (error.response?.status) {
										case 404:
											return `Cannot find 'Place' in our record. Please try again later.`;

										default:
											return `${error.message}. Please try again later.`;
									}
								},
							}),
						},
					},
				},
				encoding: {
					on: {
						CHANGE_MODE: "#meterEntryMachine.create",
						SUBMIT: {
							target: "#meterEntryMachine.update.updating",
							actions: assign({
								payload: (context, event) => event.payload,
							}),
						},
						RETRY: "#meterEntryMachine.update.updating",
					},
				},
				updating: {
					invoke: {
						src: (context) => PUT({ endpoint: context.endpoint, abortSignal: context.abortController.signal, body: context.payload }),
						onDone: "#meterEntryMachine.update.succeeded",
						onError: {
							target: "#meterEntryMachine.update.failed",
							actions: assign({
								hasError: (_, e) => true,
								errorMessage: (_, event) => {
									const error: AxiosError = event.data;
									switch (error.response?.status) {
										case 404:
											return `Cannot find 'Place' in our record. Please try again later.`;
										case 400:
											return `Bad request error. Please try again later.`;
										default:
											return `${error.message}. Please try again later.`;
									}
								},
							}),
						},
					},
					on: {
						CANCEL: "cancelling",
					},
				},
				cancelling: {
					invoke: {
						src: (context, event) => (callback, onReceive) => {
							// This will call the abort controller to abort the request when it hits 500 milliseconds;
							const id = setTimeout(() => context.abortController.abort(), 500);
							// Perform cancel
							return () => clearTimeout(id);
						},
						onDone: "#meterEntryMachine.update.encoding",
						onError: "#meterEntryMachine.update.failed",
					},
				},
				succeeded: {
					on: {
						RESET: {
							target: "#meterEntryMachine.update.encoding",
							actions: assign({
								errorMessage: (_, e) => "",
								hasError: (_, e) => false,
								hasIncompleteFields: (_, e) => false,
							}),
						},
					},
				},
				failed: {
					on: {
						RETRY: "#meterEntryMachine.update.updating",
					},
				},
				error: {
					on: {
						RETRY: "#meterEntryMachine.update.retrieveDataById",
						CHANGE_MODE: "#meterEntryMachine.create",
					},
				},
			},
		},
	},
});

export default MeterEntryMachine;
