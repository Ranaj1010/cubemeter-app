"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import MeterChartMonitoring from "@/components/meter-chart-monitoring/component";
import { useMachine } from "@xstate/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Panel, PanelGroup, Placeholder, Stack } from "rsuite";
import { meterTypeData, meterUploadTypeData } from "../entry/data";
import { MeterPropertyItem } from "./components";
import MeterDetails from "./machine";

const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	const [current, send] = useMachine(MeterDetails);
	const pathname = usePathname();
	const option = {
		xAxis: {
			type: "category",
			data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: [120, 200, 150, 80, 70, 110, 130],
				type: "line",
			},
		],
	};
	useEffect(() => {
		if (params != null) {
			let idParams = params?.get("id");
			if (idParams) {
				send({ type: "RETRIEVE_DATA", id: idParams });
			}
		}
	}, [params]);

	useEffect(() => {
		console.log(pathname);
	}, [pathname]);

	return current.matches("retrieveDataById") ? (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle="Loading..."
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Meters",
						href: "/home/meters",
					},
					{
						title: "Loading....",
						active: true,
					},
				]}
			/>
			<Placeholder.Grid></Placeholder.Grid>
		</Stack>
	) : (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<BreadCrumbComponent
					currentTitle={current.context.payload != null ? `#${current.context.payload.serialNumber}` : "Meter not found. :("}
					breadCrumbs={[
						{
							title: "Home",
							href: "/home/dashboard",
						},
						{
							title: "Meters",
							href: "/home/meters",
						},
						{
							title: current.context.payload != null ? `#${current.context.payload.serialNumber}` : "Meter not found. :(",
							active: true,
						},
					]}
				/>
			</Stack>
			<PanelGroup accordion bordered>
				<Panel header="Details" defaultExpanded>
					<Stack direction="row" alignItems="flex-start" spacing={200} justifyContent="flex-start">
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<MeterPropertyItem label="Tenant" value={current.context.payload?.tenant?.name.toString() ?? ""} />
							<MeterPropertyItem
								label="Model"
								value={meterUploadTypeData.find((data) => data.value === current.context.payload?.meterUploadType)?.label as string}
							/>
							<MeterPropertyItem
								label="Type"
								value={meterTypeData.find((data) => data.value === current.context.payload?.meterType)?.label as string}
							/>
						</Stack>
						<Stack direction="column" alignItems="stretch" spacing={10} style={{ paddingTop: 15 }}>
							<MeterPropertyItem label="Ratio" value={current.context.payload?.ratio.toString() ?? ""} />
							<MeterPropertyItem label="Sort Number" value={current.context.payload?.sortNumber.toString() ?? ""} />
							<MeterPropertyItem label="Remarks" value={current.context.payload?.remarks.toString() ?? ""} />
						</Stack>
					</Stack>
				</Panel>
			</PanelGroup>

			{current.context.payload != null && <MeterChartMonitoring meter={current.context.payload} />}
		</Stack>
	);
};

export default Page;
