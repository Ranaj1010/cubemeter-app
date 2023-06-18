"use client";
import { BreadCrumbComponent } from "@/components/breadcrumbs";
import { FailedNotification, SuccessNotification } from "@/components/notifications";
import { IMeterReading } from "@/models/meter-reading";
import { IMeterReadingBatch } from "@/models/meter-reading-batch";
import { useMachine } from "@xstate/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { MdPrint } from "react-icons/md";
import { Button, Nav, Placeholder, Stack, useToaster } from "rsuite";
import { MeterReadingBatchTableComponent } from "./component";
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

	const handleViewMeterReadingBatchDetails = (batch: IMeterReadingBatch) => router.push(`/home/reports/details?id=${batch.id}`);

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

	useEffect(() => {
		if (current.matches("generateMeterReading.success")) {
			toaster.push(<SuccessNotification title="Success" message="Reading has been generated." onCloseNotification={() => toaster.clear()} />, {
				duration: 3000,
				placement: placement,
			});
			send("FETCH_METER_READING_BATCHES");
		}
		if (current.matches("generateMeterReading.failed")) {
			toaster.push(
				<FailedNotification
					title="Failed"
					message={current.context.errorMessage}
					onRetry={() => send("RETRY")}
					onCancel={() => {
						send("CANCEL");
						toaster.clear();
					}}
				/>,
				{
					placement: placement,
					duration: 50000,
				}
			);
		}
	}, [current.value]);

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
					<Button
						appearance="primary"
						startIcon={<MdPrint />}
						loading={current.matches("generateMeterReading.generating")}
						disabled={!current.matches("idle")}
						onClick={() => send("GENERATE_METER_READING")}
					>
						Generate Reading
					</Button>
					{current.matches("fetchingMeterReadingData.fetching") && <Placeholder.Grid rows={5} columns={6} active />}
					{!current.matches("fetchingMeterReadingData.fetching") && (
						<MeterReadingBatchTableComponent
							ref={meterReadingTableRef}
							data={current.context.batches}
							limit={limit}
							page={page}
							onChangePage={setPage}
							onChangeLimit={setLimit}
							onHandleSortColumn={handleSortColumn}
							sortColumn={sortColumn}
							sortType={sortType}
							onHandleView={handleViewMeterReadingBatchDetails}
						/>
					)}
				</Stack>
			)}
		</Stack>
	);
};

export default Page;
