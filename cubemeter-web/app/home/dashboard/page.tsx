"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { useMachine } from "@xstate/react";
import ReactEcharts from "echarts-for-react";
import { MdRefresh } from "react-icons/md";
import { Button, Message, Panel, Stack } from "rsuite";
import DashboardMachine from "./machine";
export default function Page() {
	const [current, send] = useMachine(DashboardMachine);
	const powerConsumptionOptions = {
		title: {
			text: "Power Consumptions",
		},
		tooltip: {
			formatter: "Power Consumption: {c} kWh",
		},
		xAxis: {
			type: "category",
			axisLabel: { interval: 0, rotate: 30 },
			data: current.context.powerConsumptions.length > 0 ? current.context.powerConsumptions.map((power) => power.tenant.name) : [],
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: current.context.powerConsumptions.length > 0 ? current.context.powerConsumptions.map((power) => power.powerConsumption) : [],
				type: "bar",
				showBackground: true,
				backgroundStyle: {
					color: "rgba(180, 180, 180, 0.2)",
				},
			},
		],
	};
	const tenantLoadOptions = {
		title: {
			text: "Loads",
		},
		tooltip: {
			formatter: "Load: {c} kw",
		},
		xAxis: {
			type: "category",
			axisLabel: { interval: 0, rotate: 30 },
			data: current.context.tenantLoads.length > 0 ? current.context.tenantLoads.map((load) => load.tenant.name) : [],
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: current.context.tenantLoads.length > 0 ? current.context.tenantLoads.map((load) => load.load) : [],
				type: "bar",
				showBackground: true,
				backgroundStyle: {
					color: "rgba(180, 180, 180, 0.2)",
				},
			},
		],
	};
	return (
		<Stack direction="column" spacing={20} alignItems="flex-start">
			<BreadCrumbComponent
				currentTitle="Dashboard"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home",
					},
					{
						title: "Overview",
						href: "/home/dashboard",
						active: true,
					},
					{
						title: "Dashboard",
						active: true,
					},
				]}
			/>
			<Button appearance="primary" startIcon={<MdRefresh />} disabled={!current.matches("idle")} onClick={() => send("FETCH")}>
				Refresh
			</Button>
			<Stack.Item alignSelf="stretch">
				{current.matches("failed") && (
					<Message showIcon type="error" style={{ width: "100%" }} header="Error">
						{current.context.errorMessage}
					</Message>
				)}
			</Stack.Item>
			<Stack.Item alignSelf="stretch" grow={10}>
				<Stack wrap direction="column" spacing={20} alignItems="stretch">
					<Stack.Item alignSelf="stretch" flex={2}>
						<Panel bordered bodyFill>
							<ReactEcharts
								style={{ height: "500px", width: "100%", padding: 20 }}
								showLoading={current.matches("fetchingData")}
								option={powerConsumptionOptions}
							/>
						</Panel>
					</Stack.Item>
					<Stack.Item alignSelf="stretch" flex={2}>
						<Panel bordered bodyFill>
							<ReactEcharts
								style={{ height: "500px", width: "100%", padding: 20 }}
								showLoading={current.matches("fetchingData")}
								option={tenantLoadOptions}
							/>
						</Panel>
					</Stack.Item>
				</Stack>
			</Stack.Item>
		</Stack>
	);
}
