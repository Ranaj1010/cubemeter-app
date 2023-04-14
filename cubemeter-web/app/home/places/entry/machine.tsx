import { IEntryModeEnum } from "@/components/form-controls";
import IPlace from "@/models/place";
import { GET, POST, PUT } from "@/utilities/http-services";
import { AxiosError } from "axios";
import { Machine, assign } from "xstate";

interface IContextProps {
	id?: string;
	payload?: IPlace;
	hasError: boolean;
	errorMessage: string;
	hasIncompleteFields: boolean;
	abortController: AbortController;
	endpoint: string;
	mode: IEntryModeEnum;
}

interface IStates {
	states: {
		create: {
			states: {
				encoding: {};
				creating: {};
				cancelling: {};
				succeeded: {};
				failed: {};
			};
		};
		update: {
			states: {
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
	| { type: "SUBMIT"; payload: IPlace }
	| { type: "CANCEL" }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "ALLOW_NEXT"; value: boolean }
	| { type: "ALLOW_SUBMIT"; value: boolean }
	| { type: "CHANGE_MODE" }
	| { type: "RETRIEVE_DATA"; id: string };

const AddPlaceMachine = Machine<IContextProps, IStates, ITypes>({
	/** @xstate-layout N4IgpgJg5mDOIC5QEMIQAoBtkGMwFlcALASwDswA6MMnAewnKgGIBBAEXYG0AGAXUSgADnVgkALiTplBIAB6IATIoAclACyKAjCoBsAdgCsugJzrdPPQBoQAT0QBmS5X08n+k5cUmHi9QF9-G1QMbDxCHFIKaloGJjYAGQSAeQB1AH0AOQBRAA0AFV4BJBARMUlpWQUEQx5KFVUtdR4-BzaHTRt7BG91SkN9FR59Dy0fE31FQOC0LFwCYnIqGnpGMhZWJLT0gGUAVQAhfABJQv5ZMokpGRLq9S1KEyfnl+frO0QxtXVnwwddZRtEyKBzTEAhObhRbRFZxdbMABK2XyCIAmkULqIrpVbkpVBptHojKZzJZdF0lIY1Io3MN1JoVKNDGCIWEFpEljFVvEAMKsTI87IJDElS4VG6garKb6EgzGMwWd7dZp9QZaGltDxPNyBIIgMgMOCyVnzCJRMCY8rXKqIAC0ukoPCdzpdzqaFIQ9sdrp9Tv0LNmbLNnNhaygluxEvkiFcjq0xgcIza6sMEw9DhMhkoumMNOUWl06kMhi0AdCpuhVBwACcwMhJOsI+KbQgHCWXDmqeZ1CoGh51Om-C5NFoHCp1YynSoy5D2ebKDhkLQwJhMEwm9bca32-pOypu73FP2Pc0s40NYnnjq9SaoRzorAAK44PCQSAbnGSxC6ByPXSM4wmjHQtFGLD0mjqV1mgBcc3GZG9Awre8qAAM2QEhMHfUUsWbLcVF-RNah4AxPHUXdzA9ccNFeZo9FMRNdX8IA */
	id: "addPlaceMachine",
	initial: "create",
	context: {
		mode: IEntryModeEnum.create,
		endpoint: "/place",
		errorMessage: "",
		hasError: false,
		hasIncompleteFields: true,
		abortController: new AbortController(),
	},
	states: {
		create: {
			initial: "encoding",
			states: {
				encoding: {
					on: {
						CHANGE_MODE: "#addPlaceMachine.update",
						SUBMIT: {
							target: "#addPlaceMachine.create.creating",
							actions: assign({
								payload: (context, event) => event.payload,
							}),
						},
						RETRY: "#addPlaceMachine.create.creating",
					},
				},
				creating: {
					invoke: {
						src: (context) => POST({ endpoint: context.endpoint, abortSignal: context.abortController.signal, body: context.payload }),
						onDone: "#addPlaceMachine.create.succeeded",
						onError: {
							target: "#addPlaceMachine.create.failed",
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
						onDone: "#addPlaceMachine.create.encoding",
						onError: "#addPlaceMachine.create.failed",
					},
				},
				succeeded: {
					on: {
						RESET: {
							target: "#addPlaceMachine.create.encoding",
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
						RETRY: "#addPlaceMachine.create.creating",
					},
				},
			},
		},
		update: {
			initial: "encoding",
			states: {
				retrieveDataById: {
					invoke: {
						src: (context) => GET({ endpoint: context.endpoint + `/${context.id}`, abortSignal: context.abortController.signal }),
						onDone: {
							target: "#addPlaceMachine.update.encoding",
							actions: assign({
								payload: (_, event) => event.data.data.data,
							}),
						},
						onError: {
							target: "#addPlaceMachine.update.error",
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
						CHANGE_MODE: "#addPlaceMachine.create",
						RETRIEVE_DATA: {
							target: "#addPlaceMachine.update.retrieveDataById",
							actions: assign({
								id: (_, event) => event.id,
							}),
						},

						SUBMIT: {
							target: "#addPlaceMachine.update.updating",
							actions: assign({
								payload: (context, event) => event.payload,
							}),
						},
						RETRY: "#addPlaceMachine.update.updating",
					},
				},
				updating: {
					invoke: {
						src: (context) => PUT({ endpoint: context.endpoint, abortSignal: context.abortController.signal, body: context.payload }),
						onDone: "#addPlaceMachine.update.succeeded",
						onError: {
							target: "#addPlaceMachine.update.failed",
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
						onDone: "#addPlaceMachine.update.encoding",
						onError: "#addPlaceMachine.update.failed",
					},
				},
				succeeded: {
					on: {
						RESET: {
							target: "#addPlaceMachine.update.encoding",
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
						RETRY: "#addPlaceMachine.update.updating",
					},
				},
				error: {
					on: {
						RETRY: "#addPlaceMachine.update.retrieveDataById",
						CHANGE_MODE: "#addPlaceMachine.create",
					},
				},
			},
		},
	},
});

export default AddPlaceMachine;
