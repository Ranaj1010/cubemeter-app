"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { InputFormControl, InputNumberFormControl, SelectFormControl, TextAreaFormControl } from "@/components/form-controls";
import { ErrorNotification, FailedNotification, SuccessNotification } from "@/components/notifications";
import IMeter from "@/models/meter";
import IPlace from "@/models/place";
import { IMeterTypeEnums, IMeterUploadTypeEnums } from "@/utilities/enums";
import PageNextIcon from "@rsuite/icons/PageNext";
import { useMachine } from "@xstate/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";
import { BreadcrumbItemProps, Button, Form, FormInstance, IconButton, Schema, Stack, useToaster } from "rsuite";
import { ctRatioTypeData, meterTypeData, meterUploadTypeData } from "./data";
import { meterTypeRule, meterUploadTypeRule, nameRule, ratioRule, serialNumberRule, tenantIdRule } from "./form-rules";
import MeterEntryMachine from "./machine";

interface IFormProp {
	name: string;
	tenantId: string;
	meterType: IMeterTypeEnums;
	meterUploadType: IMeterUploadTypeEnums;
	ratio: string;
	remarks: string;
	sortNumber: number;
	serialNumber: string;
}

const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	//#region  machine
	const [current, send] = useMachine(MeterEntryMachine);
	//#endregion

	//#region toaster
	const toaster = useToaster();
	const placement = "topEnd";
	//#endregion

	const entryPlaceBreadCrumbProps: BreadcrumbItemProps[] = [
		{
			title: "Home",
			href: "/home/dashboard",
		},
		{
			title: "Meters",
			href: "/home/meters",
		},
		{
			title: current.matches("create") ? "Create New Meter" : "Update Meter",
			active: true,
		},
	];

	const initialValue: IFormProp = {
		name: "",
		tenantId: "",
		meterType: IMeterTypeEnums.SinglePhase,
		meterUploadType: IMeterUploadTypeEnums.IMeter,
		ratio: "Default",
		remarks: "",
		sortNumber: 0,
		serialNumber: "",
	};
	const model = Schema.Model({
		name: nameRule,
		tenantId: tenantIdRule,
		meterType: meterTypeRule,
		meterUploadType: meterUploadTypeRule,
		ratio: ratioRule,
		serialNumber: serialNumberRule,
	});
	const formRef = useRef<any>();
	const [isConnectionConfirmed, setIsConnectionConfirmed] = useState(false);
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

		const tenant: IMeter = {
			id: current.context.payload?.id,
			name: formValue.name,
			meterType: formValue.meterType,
			meterUploadType: formValue.meterUploadType,
			tenantId: Number.parseInt(formValue.tenantId),
			remarks: formValue.remarks,
			serialNumber: formValue.serialNumber,
			ratio: formValue.ratio,
			sortNumber: formValue.sortNumber,
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
			toaster.push(<SuccessNotification title="Success" message="Meter has been created successfully." onCloseNotification={onHandleReset} />, {
				duration: 3000,
				placement: placement,
			});
		}
		if (current.matches("create.failed")) {
			toaster.push(<FailedNotification title="Failed" message={current.context.errorMessage} onRetry={onHandleRetry} />, {
				duration: 3000,
				placement: placement,
			});
		}

		if (current.matches("update.succeeded")) {
			toaster.push(<SuccessNotification title="Success" message="Meter has been updated successfully." onCloseNotification={onHandleReset} />, {
				duration: 3000,
				placement: placement,
			});
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
				tenantId: current.context.payload?.tenantId.toString() ?? "",
				meterType: current.context.payload?.meterType ?? IMeterTypeEnums.SinglePhase,
				meterUploadType: current.context.payload?.meterUploadType ?? IMeterUploadTypeEnums.IMeter,
				serialNumber: current.context.payload?.serialNumber ?? "",
				ratio: current.context.payload?.ratio ?? "",
				remarks: current.context.payload?.remarks ?? "",
				sortNumber: current.context.payload?.sortNumber ?? 0,
			});
		}

		if (current.matches("update.error")) {
			notFound();
		}
	}, [current.value]);
	//#endregion

	useEffect(() => {
		if (params != null) {
			let idParams = params?.get("id");
			if (idParams) {
				send("CHANGE_MODE");
				send({ type: "RETRIEVE_DATA", id: idParams });
			}

			let tenantIdParams = params?.get("tenantId");
			if (tenantIdParams) {
				setFormValue({
					name: "",
					tenantId: tenantIdParams,
					meterType: IMeterTypeEnums.SinglePhase,
					meterUploadType: IMeterUploadTypeEnums.IMeter,
					serialNumber: "",
					ratio: "",
					remarks: "",
					sortNumber: 0,
				});
			}
		}
	}, [params]);

	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle={current.matches("create") ? "Create New Meter" : "Update Meter"}
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
					<SelectFormControl
						name="tenantId"
						formlabel="Tenant"
						placeholder="Select Tenant"
						data={current.context.tenants.map((item: IPlace) => ({
							label: item.name,
							value: item.id?.toString(),
						}))}
						searchable
						required
					/>
					<SelectFormControl name="meterType" formlabel="Type" placeholder="Select Type" data={meterTypeData} searchable required />
					<SelectFormControl
						name="meterUploadType"
						formlabel="Upload Type"
						placeholder="Select Upload Type"
						data={meterUploadTypeData}
						searchable
						required
					/>
					<SelectFormControl name="ratio" formlabel="CT Ratio" placeholder="Select Upload Type" data={ctRatioTypeData} required />
					<InputFormControl name="serialNumber" formlabel="Serial No." placeholder="Enter Serial Number" required />
					<InputNumberFormControl name="sortNumber" formlabel="Sort No." placeholder="Enter Sort No." />
					<TextAreaFormControl name="remarks" formlabel="Remarks" placeholder="Enter Remarks" />
					<Stack direction="column" spacing={30} alignItems="flex-start">
						<h5>MQTT </h5>
						<Stack.Item style={{ marginBottom: "20px" }}>
							<Stack alignItems="flex-end" spacing={10}>
								<InputFormControl name="name" formlabel="Topic Name" required placeholder="Enter Topic Name" />
								<Button color="green" appearance="ghost">
									Test Connection
								</Button>
							</Stack>
						</Stack.Item>
					</Stack>
				</Form>
			</Stack>
			<Stack direction="row">
				{current.matches("create.encoding") && (
					<IconButton
						icon={<PageNextIcon />}
						loading={current.matches("create.creating")}
						placement="right"
						appearance="primary"
						disabled={!isConnectionConfirmed}
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
						disabled={!isConnectionConfirmed}
						appearance="primary"
						onClick={onHandleSubmit}
					>
						{current.matches("create.creating") ? "Submitting" : "Submit"}
					</IconButton>
				)}

				{current.matches("create.succeeded") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={() => router.push("/home/meters")}>
						Done
					</IconButton>
				)}
				{current.matches("update.succeeded") && (
					<IconButton icon={<PageNextIcon />} placement="right" appearance="primary" onClick={() => router.push("/home/meters")}>
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
