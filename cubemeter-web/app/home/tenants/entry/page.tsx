"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { InputFormControl, InputNumberFormControl, SelectFormControl, TextAreaFormControl } from "@/components/form-controls";
import { ErrorNotification, FailedNotification, SuccessNotification } from "@/components/notifications";
import IPlace from "@/models/place";
import ITenant from "@/models/tenant";
import PageNextIcon from "@rsuite/icons/PageNext";
import { useMachine } from "@xstate/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";
import { BreadcrumbItemProps, Form, FormInstance, IconButton, Schema, Stack, useToaster } from "rsuite";
import { gatewayRule, nameRule, placeIdRule, serialNumberRule, unitIdRule } from "./form-rules";
import TenantEntry from "./machine";

interface IFormProp {
	name: string;
	placeId: string;
	unitId: string;
	serialNumber: string;
	gateway: string;
	remarks: string;
}

const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	//#region  machine
	const [current, send] = useMachine(TenantEntry);
	//#endregion

	//#region toaster
	const toaster = useToaster();
	const placement = "topEnd";
	//#endregion

	//#region stepper
	const [step, setStep] = useState(0);
	//#endregion

	const entryPlaceBreadCrumbProps: BreadcrumbItemProps[] = [
		{
			title: "Home",
			href: "/home/dashboard",
		},
		{
			title: "Tenants",
			href: "/home/tenants",
		},
		{
			title: current.matches("create") ? "Create New Tenant" : "Update Tenant",
			active: true,
		},
	];

	const initialValue: IFormProp = {
		name: "",
		placeId: "",
		unitId: "",
		serialNumber: "",
		gateway: "",
		remarks: "",
	};
	const model = Schema.Model({
		name: nameRule,
		placeId: placeIdRule,
		unitId: unitIdRule,
		serialNumber: serialNumberRule,
		gateway: gatewayRule,
	});
	const formRef = useRef<any>();
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState<IFormProp>(initialValue);

	const onHandleSubmit = () => {
		//#region Location Validation
		if (!formRef.current!.check()) {
			toaster.push(<ErrorNotification title="Incomplete Fields" message="Please complete all fields before submitting." />, {
				duration: 3000,
				placement: placement,
			});
			return;
		}

		const tenant: ITenant = {
			id: current.context.payload?.id,
			name: formValue.name,
			gateway: formValue.gateway,
			placeId: Number.parseInt(formValue.placeId),
			dateRegistered: current.context.payload?.dateRegistered!,
			remarks: formValue.remarks,
			serialNumber: formValue.serialNumber,
			unitId: Number.parseInt(formValue.unitId),
		};
		send({ type: "SUBMIT", payload: tenant });
	};

	const onHandleRetry = () => send("RETRY");

	const onHandleReset = () => {
		toaster.clear();
	};

	//#region Notification Observable
	useEffect(() => {
		if (current.matches("create.succeeded")) {
			toaster.push(
				<SuccessNotification title="Success" message="Tenant has been created successfully." onCloseNotification={onHandleReset} />,
				{
					duration: 3000,
					placement: placement,
				}
			);
		}
		if (current.matches("create.failed")) {
			toaster.push(<FailedNotification title="Failed" message={current.context.errorMessage} onRetry={onHandleRetry} />, {
				duration: 3000,
				placement: placement,
			});
		}

		if (current.matches("update.succeeded")) {
			toaster.push(
				<SuccessNotification title="Success" message="Tenant has been updated successfully." onCloseNotification={onHandleReset} />,
				{
					duration: 3000,
					placement: placement,
				}
			);
		}
		if (current.matches("update.failed")) {
			toaster.push(<FailedNotification title="Failed" message={current.context.errorMessage} onRetry={onHandleRetry} />, {
				duration: 3000,
				placement: placement,
			});
		}

		if (current.matches("update.encoding") && current.context.payload) {
			setFormValue({
				name: current.context.payload?.name ?? "",
				placeId: current.context.payload?.placeId.toString() ?? "",
				unitId: current.context.payload?.unitId.toString() ?? "",
				serialNumber: current.context.payload?.serialNumber ?? "",
				gateway: current.context.payload?.gateway ?? "",
				remarks: current.context.payload?.remarks ?? "",
			});
		}

		if (current.matches("update.error")) {
			notFound();
		}
	}, [current.value]);
	//#endregion

	useEffect(() => {
		let idParams = params?.get("id");
		if (idParams) {
			send("CHANGE_MODE");
			send({ type: "RETRIEVE_DATA", id: idParams });
		}
	}, []);

	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle={current.matches("create") ? "Create New Tenant" : "Update Tenant"}
				breadCrumbs={entryPlaceBreadCrumbProps}
			/>
			<Stack direction="column" spacing={30} alignItems="flex-start">
				<h5>Basic Details</h5>
				<Form
					ref={formRef as unknown as Ref<FormInstance>}
					onChange={(value, event?) => setFormValue(value as any)}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
				>
					<InputFormControl name="name" formLabel="Name" required placeHolder="Enter Name" />
					<SelectFormControl
						name="placeId"
						formLabel="Place"
						placeHolder="Select Place"
						data={current.context.places.map((item: IPlace) => ({
							label: item.name,
							value: item.id?.toString(),
						}))}
						searchable
						required
					/>
					<InputNumberFormControl name="unitId" formLabel="Unit Id" placeHolder="Entert Unit Id" required />
					<InputFormControl name="gateway" formLabel="Gateway" placeHolder="Enter Gateway Number" required />
					<InputFormControl name="serialNumber" formLabel="Serial No." placeHolder="Enter Serial Number" required />
					<TextAreaFormControl name="remarks" formLabel="Remarks" placeHolder="Enter Remarks" />
				</Form>
			</Stack>
			<Stack direction="row">
				{current.matches("create.encoding") && (
					<IconButton
						icon={<PageNextIcon />}
						loading={current.matches("create.creating")}
						placement="right"
						appearance="primary"
						onClick={onHandleSubmit}
					>
						{current.matches("create.creating") ? "Submitting" : "Submit"}
					</IconButton>
				)}

				{current.matches("update.encoding") && (
					<IconButton
						icon={<PageNextIcon />}
						loading={current.matches("update.updating")}
						placement="right"
						appearance="primary"
						onClick={onHandleSubmit}
					>
						{current.matches("create.creating") ? "Submitting" : "Submit"}
					</IconButton>
				)}

				{current.matches("create.succeeded") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={() => router.push("home/tenants")}>
						Done
					</IconButton>
				)}
				{current.matches("update.succeeded") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={() => router.push("home/tenants")}>
						Done
					</IconButton>
				)}

				{current.matches("create.failed") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onHandleRetry}>
						Retry
					</IconButton>
				)}
				{current.matches("update.failed") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={onHandleRetry}>
						Retry
					</IconButton>
				)}
			</Stack>
		</Stack>
	);
};

export default Page;
