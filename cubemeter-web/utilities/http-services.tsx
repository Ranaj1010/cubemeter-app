"use client";

import axios, { GenericAbortSignal } from "axios";

const API_URL = process.env.API_URL;

//#region GET
interface IGETProps {
	endpoint: string;
	abortSignal: GenericAbortSignal;
}

export const GET = (props: IGETProps) => axios({ baseURL: API_URL, method: "GET", url: props.endpoint, signal: props.abortSignal });
//#endregion

//#region POST
interface IPOSTProps {
	endpoint: string;
	body: any;
	abortSignal: GenericAbortSignal;
}

export const POST = (props: IPOSTProps) =>
	axios({ baseURL: API_URL, method: "post", url: props.endpoint, data: props.body, signal: props.abortSignal });
//#endregion

//#region PUT
interface IPUTProps {
	endpoint: string;
	body: any;
	abortSignal: GenericAbortSignal;
}

export const PUT = (props: IPUTProps) => axios({ baseURL: API_URL, method: "PUT", url: props.endpoint, data: props.body, signal: props.abortSignal });
//#endregion

//#region DELETE
interface IDELETEProps {
	endpoint: string;
	abortSignal: GenericAbortSignal;
}

export const DELETE = (props: IDELETEProps) => axios({ baseURL: API_URL, method: "DELETE", url: props.endpoint, signal: props.abortSignal });
//#endregion
