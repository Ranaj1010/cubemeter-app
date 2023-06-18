"use client";
import IMeter, { ICustomMeter } from "@/models/meter";
import EditIcon from "@rsuite/icons/Edit";
import DeleteIcon from "@rsuite/icons/Trash";
import { Button, IconButton, Pagination, Stack, Table } from "rsuite";
import { SortType } from "rsuite/esm/Table";
import { meterUploadTypeData } from "./entry/data";
const { Column, HeaderCell, Cell } = Table;
interface IMeterTableProp {
	data: ICustomMeter[];
	limit: number;
	page: number;
	onChangeLimit: (limit: number) => void;
	onChangePage: (page: number) => void;
	onHandleEdit: (meter: ICustomMeter) => void;
	onHandleDelete: (meter: ICustomMeter) => void;
	onHandleView: (meter: ICustomMeter) => void;
	sortColumn: any;
	sortType: any;
	onHandleSortColumn: (dataKey: string, sortType?: SortType | undefined) => void;
}

export const MeterTableComponent = (props: IMeterTableProp) => {
	const { data, limit, page, onChangeLimit, onChangePage, onHandleView, sortColumn, onHandleDelete, onHandleEdit, sortType, onHandleSortColumn } =
		props;

	return (
		<div>
			<Table autoHeight data={data} sortColumn={sortColumn} sortType={sortType} onSortColumn={onHandleSortColumn}>
				<Column width={250} fixed sortable>
					<HeaderCell>Serial Number</HeaderCell>
					<Cell dataKey="serialNumber" style={{ padding: "5px" }}>
						{(rowData) => (
							<Stack direction="row">
								<Stack.Item>
									<Button appearance="link" onClick={() => onHandleView(rowData as ICustomMeter)}>
										{(rowData as IMeter).serialNumber}
									</Button>
								</Stack.Item>
							</Stack>
						)}
					</Cell>
				</Column>

				<Column width={100} flexGrow={1}>
					<HeaderCell>Model</HeaderCell>
					<Cell dataKey="meterType">
						{(rowData) => (
							<label>{meterUploadTypeData.find((data) => data.value === (rowData as ICustomMeter).meterUploadType)?.label}</label>
						)}
					</Cell>
				</Column>
				<Column width={100} flexGrow={1}>
					<HeaderCell>Tenant</HeaderCell>
					<Cell dataKey="tenant">{(rowData) => <label>{(rowData as ICustomMeter).tenant?.name}</label>}</Cell>
				</Column>
				<Column width={100} flexGrow={1}>
					<HeaderCell>kWh</HeaderCell>
					<Cell dataKey="kilowatthour">{(rowData) => <label>{(rowData as ICustomMeter).kilowatthour}</label>}</Cell>
				</Column>

				<Column width={200} flexGrow={1} sortable>
					<HeaderCell>Remarks</HeaderCell>
					<Cell dataKey="remarks" />
				</Column>

				<Column width={20} flexGrow={1}>
					<HeaderCell>Actions</HeaderCell>
					<Cell style={{ padding: "5px" }} dataKey="edit">
						{(rowData) => (
							<Stack direction="row" spacing={20}>
								<IconButton
									icon={<EditIcon />}
									appearance="subtle"
									color="blue"
									onClick={() => onHandleEdit(rowData as ICustomMeter)}
								/>
								<IconButton
									icon={<DeleteIcon />}
									appearance="subtle"
									color="red"
									onClick={() => onHandleDelete(rowData as ICustomMeter)}
								/>
							</Stack>
						)}
					</Cell>
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
