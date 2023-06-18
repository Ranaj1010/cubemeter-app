"use client";

import { BreadCrumbComponent } from "@/components/breadcrumbs";
import ExportToExcel from "@/utilities/export-to-excel";
import { useMachine } from "@xstate/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdDownload } from "react-icons/md";
import { Button, Placeholder, Stack } from "rsuite";
import { MeterReadingTableComponent } from "../component";
import MeterDetails from "./machine";

const Page = () => {
	const params = useSearchParams();
	const router = useRouter();
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [navKey, setNavKey] = useState("meter-reading");
	const [sortColumn, setSortColumn] = useState();
	const [sortType, setSortType] = useState();
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
	const meterReadingTableRef = useRef(null);
	const header = [
		"Meter No",
		"Reading",
		"Date",
		"Time",
		"Initial",
		"Building",
		"Tenant Name",
		"Meter Type",
		"Current Reading",
		"Previous",
		"Multi",
		"Current Consumption",
		"Prev Consumtion",
		"%Diff",
	];
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

	const handleSortColumn = (sortColumn: any, sortType: any) => {
		setSortColumn(sortColumn);
		setSortType(sortType);
	};

	const handleDownloadExcel = () => {
		let formatedData = current.context.data.map((data) => {
			return {
				"Meter No": data.meterNo,
				"Reading ": data.reading,
				Date: data.date,
				Time: data.time,
				Initial: data.initial,
				"Building No.": data.building,
				Tenant: data.tenantName,
				"Meter Type": data.meterType,
				"Current Reading": data.currentReading,
				"Previous Reading": data.previousReading,
				Multi: data.multi,
				"Current Consumption": data.currentConsumption,
				"Prev Consumption": data.previousConsumption,
				"%Diff": data.percentageDifference,
			};
		});
		ExportToExcel({
			fileName: `CUBEMETER_READING_REPORT_${new Date(current.context.payload!.createdAt).toUTCString()}`,
			rawData: formatedData,
		});
	};
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
					currentTitle={
						current.context.payload != null
							? `${new Date(current.context.payload.createdAt).toUTCString()}`
							: "Meter Readings not found. :("
					}
					breadCrumbs={[
						{
							title: "Home",
							href: "/home/dashboard",
						},
						{
							title: "Reports",
							href: "/home/reports",
						},
						{
							title:
								current.context.payload != null
									? `${new Date(current.context.payload.createdAt).toUTCString()}`
									: "Meter Readings not found. :(",
							active: true,
						},
					]}
				/>
				<Stack spacing={20} alignItems="flex-end" justifyContent="flex-start">
					<Button appearance="primary" startIcon={<MdDownload />} disabled={!current.matches("idle")} onClick={() => handleDownloadExcel()}>
						Export
					</Button>
				</Stack>
			</Stack>
			{!current.matches("idle") && <Placeholder.Grid rows={5} columns={6} active />}
			{current.matches("idle") && (
				<MeterReadingTableComponent
					ref={meterReadingTableRef}
					data={current.context.data}
					limit={limit}
					page={page}
					onChangePage={setPage}
					onChangeLimit={setLimit}
					onHandleSortColumn={handleSortColumn}
					sortColumn={sortColumn}
					sortType={sortType}
				/>
			)}
		</Stack>
	);
};

export default Page;
