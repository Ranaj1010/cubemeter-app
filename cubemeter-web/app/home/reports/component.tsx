"use client";
import { IMeterReading } from "@/models/meter-reading";
import { Ref } from "react";
import { Pagination, Table } from "rsuite";
import { SortType, TableInstance } from "rsuite/esm/Table";
const { Column, HeaderCell, Cell } = Table;
interface IMeterReadingTableProp {
	data: IMeterReading[];
	limit: number;
	page: number;
	onChangeLimit: (limit: number) => void;
	onChangePage: (page: number) => void;
	sortColumn: any;
	sortType: any;
	ref?: Ref<TableInstance<IMeterReading, unknown>>;
	onHandleSortColumn: (dataKey: string, sortType?: SortType | undefined) => void;
}

export const MeterReadingTableComponent = (props: IMeterReadingTableProp) => {
	const { data, ref, limit, page, onChangeLimit, onChangePage, sortColumn, sortType, onHandleSortColumn } = props;

	return (
		<div>
			<Table ref={ref} autoHeight data={data} sortColumn={sortColumn} sortType={sortType} onSortColumn={onHandleSortColumn}>
				<Column width={250} fixed sortable>
					<HeaderCell>Meter No</HeaderCell>
					<Cell dataKey="meterNo" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Reading</HeaderCell>
					<Cell dataKey="reading" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Date</HeaderCell>
					<Cell dataKey="date" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Time</HeaderCell>
					<Cell dataKey="time" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Initial</HeaderCell>
					<Cell dataKey="initial" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Building</HeaderCell>
					<Cell dataKey="building" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Tenant Name</HeaderCell>
					<Cell dataKey="tenantName" />
				</Column>
				<Column width={250} sortable>
					<HeaderCell>Meter Type</HeaderCell>
					<Cell dataKey="meterType" />
				</Column>
				<Column width={250} sortable>
					<HeaderCell>Current Reading</HeaderCell>
					<Cell dataKey="currentReading" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Previous Reading</HeaderCell>
					<Cell dataKey="previousReading" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Multi</HeaderCell>
					<Cell dataKey="multi" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Current Consumption</HeaderCell>
					<Cell dataKey="currentConsumption" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>Prev Consumption</HeaderCell>
					<Cell dataKey="previousConsumption" />
				</Column>

				<Column width={250} sortable>
					<HeaderCell>%Diff</HeaderCell>
					<Cell dataKey="percentageDifference" />
				</Column>
			</Table>
			<div style={{ padding: 20 }}>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					maxButtons={5}
					size="xs"
					layout={["total", "-", "limit", "|", "pager", "skip"]}
					total={data.length}
					limitOptions={[10, 30, 50]}
					limit={limit}
					activePage={page}
					onChangePage={onChangePage}
					onChangeLimit={onChangeLimit}
				/>
			</div>
		</div>
	);
};
