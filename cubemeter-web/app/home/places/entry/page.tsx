"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { InputFormControl, InputNumberFormControl, RequiredFieldLabelText, SelectFormControl, TextAreaFormControl } from "@/components/form-controls";
import { ILatLngProps, MapInputControl, MapViewControl } from "@/components/map-controls";
import { ErrorNotification, FailedNotification, SuccessNotification } from "@/components/notifications";
import { IStepperItemProp, StepperComponent, StepperStateEnum } from "@/components/stepper";
import IPlace from "@/models/place";
import ITieredRate from "@/models/tiered-rate";
import { useMachine } from "@xstate/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Ref, createRef, useEffect, useRef, useState } from "react";
import { ViewState } from "react-map-gl";
import { BreadcrumbItemProps, Col, Form, FormInstance, InputNumber, Nav, Panel, Schema, Stack, useToaster } from "rsuite";
import { ReviewAndConfirmItem, TieredRateComponent } from "./components";
import { billingDayData, countriesData, currenciesData, mockTieredRates, timeZoneData } from "./data";
import { addressRule, cityRule, countryRule, nameRule, regionRule, timezoneRule } from "./form-rules";
import AddPlaceMachine from "./machine";

interface IBasicDetailsProp {
	name: string;
	timezone: string;
	country: string;
	region: string;
	city: string;
	address: string;
}

interface IAdditionalInformationProp {
	currency: string;
	billingDay: number;
	serialNumber: string;
	sortNumber: number;
}

const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	//#region  machine
	const [current, send] = useMachine(AddPlaceMachine);
	//#endregion

	//#region toaster
	const toaster = useToaster();
	const placement = "topEnd";
	//#endregion

	//#region stepper
	const [step, setStep] = useState(0);
	//#endregion

	//#region power tariff
	const [activeGridConsumption, setActiveGridConsumption] = useState("fixed-rate");
	const [activeExportedEnergy, setActiveExportedEnergey] = useState("fixed-rate");
	//#endregion

	//#region map
	const initialViewStateValue: ViewState = {
		latitude: 10.296152728125051,
		longitude: 123.84539480646119,
		zoom: 5,
		bearing: 0,
		padding: {
			bottom: 0,
			left: 0,
			right: 0,
			top: 0,
		},
		pitch: 0,
	};
	const [location, setLocation] = useState<ILatLngProps>();
	const [hasMapError, setHasMapError] = useState(false);
	const [mapViewState, setMapViewState] = useState<ViewState>(initialViewStateValue);
	//#endregion

	//#region location details form
	const initialBasicDetailsValue: IBasicDetailsProp = current.matches("create")
		? {
				name: "",
				timezone: "",
				country: "",
				region: "",
				city: "",
				address: "",
		  }
		: {
				name: current.context.payload?.name ?? "",
				timezone: current.context.payload?.timezone ?? "",
				country: current.context.payload?.country ?? "",
				region: current.context.payload?.region ?? "",
				city: current.context.payload?.city ?? "",
				address: current.context.payload?.address ?? "",
		  };

	const locationDetailsModel = Schema.Model({
		name: nameRule,
		timezone: timezoneRule,
		country: countryRule,
		region: regionRule,
		city: cityRule,
		address: addressRule,
	});
	const locationDetailsFormRef = useRef<any>(createRef());
	const [locationDetailsformError, setLocationDetailsFormError] = useState({});
	const [locationDetailsFormValue, setLocationDetailsFormValue] = useState<IBasicDetailsProp>(initialBasicDetailsValue);

	//#endregion

	//#region additional information form
	const initialAdditionalInfoValue: IAdditionalInformationProp = {
		currency: "",
		billingDay: 0,
		serialNumber: "",
		sortNumber: 0,
	};
	const additionalInformationFormRef = useRef<any>(createRef());
	const [additionalInformationFormError, setAdditionalInformationFormError] = useState({});
	const [additionalInformationFormValue, setAdditionalInformationFormValue] = useState<IAdditionalInformationProp>(initialAdditionalInfoValue);
	//#endregion

	const entryPlaceBreadCrumbProps: BreadcrumbItemProps[] = [
		{
			title: "Home",
			href: "/home/dashboard",
		},
		{
			title: "Places",
			href: "/home/places",
		},
		{
			title: current.matches("create") ? "Create New Place" : "Update Place",
			active: true,
		},
	];

	const onHandleSubmit = () => {
		const place: IPlace = {
			id: current.context.payload?.id,
			name: locationDetailsFormValue.name,
			timezone: locationDetailsFormValue.timezone,
			country: locationDetailsFormValue.country,
			region: locationDetailsFormValue.region,
			city: locationDetailsFormValue.city,
			address: locationDetailsFormValue.address,
			latitude: location?.latitude ?? 0,
			longitude: location?.longitude ?? 0,
			currency: additionalInformationFormValue.currency,
			billingDay: additionalInformationFormValue.billingDay,
			serialNumber: additionalInformationFormValue.serialNumber,
			sortNumber: additionalInformationFormValue.sortNumber,
		};
		send({ type: "SUBMIT", payload: place });
	};

	const onHandleRetry = () => send("RETRY");

	const onHandleReset = () => {
		if (current.matches("create")) {
			setLocationDetailsFormValue(initialBasicDetailsValue);
			setAdditionalInformationFormValue(initialAdditionalInfoValue);
			setLocation(undefined);
		}
		send("RESET");
		setStep(0);
	};

	const onIdentifyCurrentState = () => {
		if (current.matches("create.encoding")) return StepperStateEnum.encoding;
		if (current.matches("update.encoding")) return StepperStateEnum.encoding;
		if (current.matches("create.creating")) return StepperStateEnum.submitting;
		if (current.matches("update.updating")) return StepperStateEnum.submitting;
		if (current.matches("create.succeeded")) return StepperStateEnum.succeeded;
		if (current.matches("update.succeeded")) return StepperStateEnum.succeeded;
		if (current.matches("create.failed")) return StepperStateEnum.failed;
		if (current.matches("update.failed")) return StepperStateEnum.failed;
	};

	const onHandleFormValidation = (newStep: number) => {
		//#region Location Validation
		if (step == 0 && !locationDetailsFormRef.current!.check()) {
			toaster.push(<ErrorNotification title="Incomplete Fields" message="Please complete all fields before submitting." />, {
				duration: 3000,
				placement: placement,
			});
			return;
		}

		if (step == 0 && !location) {
			toaster.push(<ErrorNotification title="Location not yet selected" message="Please pin the location of the place." />, {
				duration: 3000,
				placement: placement,
			});
			setHasMapError(true);
			return;
		}

		//#endregion
		setHasMapError(false);
		// change step when validation passed.
		setStep(newStep);
	};

	const basicDetailsStepperElement = (
		<Stack direction="row" alignItems="flex-start" spacing={80} justifyContent="flex-start">
			<Stack direction="column" spacing={30} alignItems="flex-start">
				<h5>Basic Details</h5>
				<Form
					ref={locationDetailsFormRef as unknown as Ref<FormInstance>}
					onChange={(value, event?) => setLocationDetailsFormValue(value as any)}
					onCheck={setLocationDetailsFormError}
					formValue={locationDetailsFormValue}
					model={locationDetailsModel}
				>
					<InputFormControl formlabel="Name" name="name" required placeholder="Enter Name" />
					<SelectFormControl
						data={timeZoneData}
						name="timezone"
						formlabel="Timezone"
						placeholder="Select timezone"
						required
						searchable={true}
					/>
					<SelectFormControl formlabel="Country" name="country" placeholder="Select Country" data={countriesData} searchable required />
					<InputFormControl formlabel="Region" name="region" placeholder="Enter Region" required />
					<InputFormControl formlabel="City" name="city" placeholder="Enter City" required />
					<TextAreaFormControl formlabel="Address" name="address" placeholder="Enter Address" required />
				</Form>
			</Stack>

			<Stack direction="column" alignItems="stretch" spacing={5} style={{ paddingTop: 55 }}>
				<RequiredFieldLabelText text="Map Location" />
				<MapInputControl
					hasError={hasMapError}
					width="60vh"
					height="49vh"
					location={location}
					viewState={mapViewState}
					onChangeViewState={(viewState) => setMapViewState(viewState)}
					onChangeMarkerLocation={(e) => {
						setLocation(e);
						setHasMapError(false);
					}}
				/>
			</Stack>
		</Stack>
	);

	const powerTariffStepperElement = (
		<Stack direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={80}>
			<Stack direction="column" spacing={30} alignItems="flex-start">
				<Stack direction="row" spacing={5}>
					<h5>Grid Consumption</h5>
					<label style={{ fontSize: 11, color: "dodgerblue" }}>Coming Soon!</label>
				</Stack>
				<Col md={4}>
					<Nav appearance="subtle" activeKey={activeGridConsumption} onSelect={setActiveGridConsumption} style={{ width: 200 }}>
						<Nav.Item eventKey="fixed-rate">Fixed Rate</Nav.Item>
						<Nav.Item eventKey="tiered-rate">Tiered Rate</Nav.Item>
						<Nav.Item eventKey="time-of-use" disabled>
							Time of Use
						</Nav.Item>
						<Nav.Item eventKey="advance-time-of-use" disabled>
							Advance Time of Use
						</Nav.Item>
					</Nav>
				</Col>
				{activeGridConsumption == "fixed-rate" && <InputNumber placeholder="Enter rate" />}
				{activeGridConsumption == "tiered-rate" && <TieredRateComponent tieredRates={mockTieredRates} onAddItem={(e: ITieredRate) => {}} />}
			</Stack>
			<Stack direction="column" spacing={30} alignItems="flex-start">
				<Stack direction="row" spacing={5}>
					<h5>Exported Energy</h5>
					<label style={{ fontSize: 11, color: "dodgerblue" }}>Coming Soon!</label>
				</Stack>
				<Col md={4}>
					<Nav appearance="subtle" activeKey={activeExportedEnergy} onSelect={setActiveExportedEnergey} style={{ width: 200 }}>
						<Nav.Item eventKey="fixed-rate">Fixed Rate</Nav.Item>
						<Nav.Item eventKey="tiered-rate">Tiered Rate</Nav.Item>
						<Nav.Item eventKey="time-of-use" disabled>
							Time of Use
						</Nav.Item>
					</Nav>
				</Col>
				{activeExportedEnergy == "fixed-rate" && <InputNumber placeholder="Enter rate" />}
				{activeExportedEnergy == "tiered-rate" && <TieredRateComponent tieredRates={mockTieredRates} onAddItem={(e: ITieredRate) => {}} />}
			</Stack>
		</Stack>
	);

	const additionalInformationStepperElement = (
		<Stack direction="column" alignItems="flex-start" spacing={30} justifyContent="flex-start">
			<h5>Additional Info</h5>
			<Form
				ref={additionalInformationFormRef as unknown as React.Ref<FormInstance>}
				onChange={(value, event?) => setAdditionalInformationFormValue(value as any)}
				onCheck={setAdditionalInformationFormError}
				formValue={additionalInformationFormValue}
			>
				<SelectFormControl name="currency" formlabel="Currency" placeholder="Select Currency" data={currenciesData} searchable />
				<SelectFormControl name="billingDay" formlabel="Billing day" placeholder="Select Billing day" data={billingDayData} />
				<InputFormControl name="serialNumber" formlabel="Serial No." placeholder="Enter Serial Number" />
				<InputNumberFormControl name="sortNumber" formlabel="Sort No." placeholder="Entert Sort No." />
			</Form>
		</Stack>
	);

	const reviewAndConfirmStepperElement = (
		<Stack direction="column" alignItems="flex-start" spacing={30}>
			<h5>Review and Confirm</h5>
			<Stack direction="row" alignItems="flex-start" justifyContent="space-around" spacing={30}>
				<Stack direction="column" alignItems="flex-start" spacing={30} justifyContent="flex-start">
					<Panel header="Basic Details" bordered expanded style={{ width: "50vh" }}>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<ReviewAndConfirmItem label="Name" value={locationDetailsFormValue.name} />
							<ReviewAndConfirmItem
								label="Timezone"
								value={timeZoneData.find((v) => v.value == locationDetailsFormValue.timezone)?.label! ?? ""}
							/>
							<ReviewAndConfirmItem
								label="Country"
								value={countriesData.find((v) => v.value == locationDetailsFormValue.country)?.label! ?? ""}
							/>
							<ReviewAndConfirmItem label="Region" value={locationDetailsFormValue.region} />
							<ReviewAndConfirmItem label="City" value={locationDetailsFormValue.city} />
							<ReviewAndConfirmItem label="Address" value={locationDetailsFormValue.address} />
						</Stack>
					</Panel>
					<Panel header="Grid Consumption" bordered expanded style={{ width: "50vh" }}>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<ReviewAndConfirmItem label="Fixed Rate" value={"0"} />
							<ReviewAndConfirmItem label="Tiered Rate" value={"3 items"} />
							<ReviewAndConfirmItem label="Time of use" value={"0"} />
						</Stack>
					</Panel>
					<Panel header="Exported Energy" bordered expanded style={{ width: "50vh" }}>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<ReviewAndConfirmItem label="Fixed Rate" value={"0"} />
							<ReviewAndConfirmItem label="Tiered Rate" value={"3 items"} />
							<ReviewAndConfirmItem label="Time of use" value={"0"} />
						</Stack>
					</Panel>
					<Panel header="Additional Info" bordered expanded style={{ width: "50vh" }}>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<ReviewAndConfirmItem
								label="Currency"
								value={currenciesData.find((result) => result.value == additionalInformationFormValue.currency)?.label! ?? ""}
							/>
							<ReviewAndConfirmItem label="Billing Day" value={additionalInformationFormValue.billingDay?.toString() ?? ""} />
							<ReviewAndConfirmItem label="Serial No." value={additionalInformationFormValue.serialNumber} />
							<ReviewAndConfirmItem label="Sort No." value={additionalInformationFormValue.sortNumber?.toString() ?? ""} />
						</Stack>
					</Panel>
				</Stack>
				<MapViewControl
					onChangeViewState={(viewState) => setMapViewState(viewState)}
					viewState={mapViewState}
					width="60vh"
					height="48vh"
					locations={[
						{
							latitude: location?.latitude ?? 0,
							longitude: location?.longitude ?? 0,
						},
					]}
				/>
			</Stack>
		</Stack>
	);

	const stepperItems: IStepperItemProp[] = [
		{
			title: "Basic Details",
			description: "",
			content: basicDetailsStepperElement,
		},
		{
			title: "Power Tariff",
			description: "",
			content: powerTariffStepperElement,
		},
		{
			title: "Additional Information",
			description: "",
			content: additionalInformationStepperElement,
		},
		{
			title: "Review and Confirm",
			description: "",
			content: reviewAndConfirmStepperElement,
		},
	];

	//#region Notification Observable
	useEffect(() => {
		if (current.matches("create.succeeded")) {
			toaster.push(<SuccessNotification title="Success" message="Place has been created successfully." onCloseNotification={onHandleReset} />, {
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
			toaster.push(<SuccessNotification title="Success" message="Place has been updated successfully." onCloseNotification={onHandleReset} />, {
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
		if (current.matches("update.error")) {
			notFound();
		}

		if (current.matches("update.encoding") && current.context.payload) {
			console.log(current.context.payload);
			setLocationDetailsFormValue({
				name: current.context.payload.name ?? "",
				address: current.context.payload.address ?? "",
				city: current.context.payload.city ?? "",
				country: current.context.payload.country ?? "",
				region: current.context.payload.region ?? "",
				timezone: current.context.payload.timezone ?? "",
			});
			setLocation({
				latitude: current.context.payload.latitude,
				longitude: current.context.payload.longitude,
			});
			setAdditionalInformationFormValue({
				billingDay: current.context.payload.billingDay,
				currency: current.context.payload.currency,
				serialNumber: current.context.payload.serialNumber,
				sortNumber: current.context.payload.sortNumber,
			});
		}
	}, [current.value]);
	//#endregion

	useEffect(() => {
		var idParams = params?.get("id");
		if (idParams) {
			send("CHANGE_MODE");
			send({ type: "RETRIEVE_DATA", id: idParams });
		}
	}, []);

	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle={current.matches("create") ? "Create New Place" : "Update Place"}
				breadCrumbs={entryPlaceBreadCrumbProps}
			/>
			<StepperComponent
				state={onIdentifyCurrentState() as StepperStateEnum}
				onRetry={onHandleRetry}
				onReset={onHandleReset}
				step={step}
				onChangeStep={onHandleFormValidation}
				onHandleSubmit={onHandleSubmit}
				items={stepperItems}
			/>
		</Stack>
	);
};

export default Page;
