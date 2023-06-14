"use client";
import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { IMeterReading } from "@/models/meter-reading";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { MdDownload, MdPrint } from "react-icons/md";
import { Button, Nav, Placeholder, Stack, useToaster } from "rsuite";
import { MeterReadingTableComponent } from "./component";
import ReportsMachine from "./machine";

const Page = () => {
	const router = useRouter();
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [navKey, setNavKey] = useState("meter-reading");
	const [sortColumn, setSortColumn] = useState();
	const [sortType, setSortType] = useState();
	const [searchKeyword, setSearchKeyword] = useState("");
	const [current, send] = useMachine(ReportsMachine);
	const toaster = useToaster();
	const placement = "topEnd";
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
	const handleSortColumn = (sortColumn: any, sortType: any) => {
		setSortColumn(sortColumn);
		setSortType(sortType);
	};

	const filteredData = () => {
		const filtered: IMeterReading[] = current.context.data.filter((item) => {
			if (!item.meterNo.includes(searchKeyword) && !item.tenantName.includes(searchKeyword) && !item.meterType?.includes(searchKeyword)) {
				return false;
			}

			return true;
		});

		if (sortColumn && sortType) {
			return filtered.sort((a, b) => {
				let x: any = a[sortColumn];
				let y: any = b[sortColumn];

				if (typeof x === "string") {
					x = x.charCodeAt(0);
				}
				if (typeof y === "string") {
					y = y.charCodeAt(0);
				}

				if (sortType === "asc") {
					return x - y;
				} else {
					return y - x;
				}
			});
		}
		return filtered;
	};

	const handleDownloadExcel = () => {
		downloadExcel({
			fileName: `CUBEMETER_READING_${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}`,
			sheet: "Meter Reading",
			tablePayload: {
				header,
				// accept two different data structures
				body: current.context.data as any[],
			},
		});
	};

	const body2 = [
		{ firstname: "Edison", lastname: "Padilla", age: 14 },
		{ firstname: "Cheila", lastname: "Rodriguez", age: 56 },
	];

	return (
		<Stack direction="column" spacing={20} alignItems="stretch">
			<BreadCrumbComponent
				currentTitle="Reports"
				breadCrumbs={[
					{
						title: "Home",
						href: "/home/dashboard",
					},
					{
						title: "Reports",
						active: true,
					},
				]}
			/>
			<Nav activeKey={navKey} onSelect={(key, event) => setNavKey(key)} appearance="subtle" style={{ marginBottom: 20 }}>
				<Nav.Item eventKey="meter-reading">Meter Reading</Nav.Item>
			</Nav>
			{navKey == "meter-reading" && (
				<Stack wrap direction="column" alignItems="stretch" spacing={20}>
					<Stack spacing={20} alignItems="flex-end" justifyContent="flex-end">
						<Button
							appearance="primary"
							startIcon={<MdPrint />}
							disabled={!current.matches("idle")}
							onClick={() => send("FETCH_METER_READING")}
						>
							Generate Reading
						</Button>

						<Button
							appearance="ghost"
							startIcon={<MdDownload />}
							disabled={!current.matches("idle")}
							onClick={() => handleDownloadExcel()}
						>
							Export
						</Button>
					</Stack>
					{current.matches("fetchingMeterReadingData.fetching") && <Placeholder.Grid rows={5} columns={6} active />}
					{!current.matches("fetchingMeterReadingData.fetching") && (
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
			)}
		</Stack>
	);
};

export default Page;
