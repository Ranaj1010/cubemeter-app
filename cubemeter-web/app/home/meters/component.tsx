"use client";
import IMeter from "@/models/meter";
import EditIcon from "@rsuite/icons/Edit";
import DeleteIcon from "@rsuite/icons/Trash";
import { IconButton, Pagination, Stack, Table } from "rsuite";
import { SortType } from "rsuite/esm/Table";
import { meterUploadTypeData } from "./entry/data";
const { Column, HeaderCell, Cell } = Table;
interface IMeterTableProp {
	data: IMeter[];
	limit: number;
	page: number;
	onChangeLimit: (limit: number) => void;
	onChangePage: (page: number) => void;
	onHandleEdit: (meter: IMeter) => void;
	onHandleDelete: (meter: IMeter) => void;
	sortColumn: any;
	sortType: any;
	onHandleSortColumn: (dataKey: string, sortType?: SortType | undefined) => void;
}

export const MeterTableComponent = (props: IMeterTableProp) => {
	const { data, limit, page, onChangeLimit, onChangePage, sortColumn, onHandleDelete, onHandleEdit, sortType, onHandleSortColumn } = props;

	return (
		<div>
			<Table autoHeight data={data} sortColumn={sortColumn} sortType={sortType} onSortColumn={onHandleSortColumn}>
				<Column width={250} fixed sortable>
					<HeaderCell>Name</HeaderCell>
					<Cell dataKey="name" />
				</Column>

				<Column width={100} flexGrow={1}>
					<HeaderCell>Model</HeaderCell>
					<Cell dataKey="meterType">
						{(rowData) => <label>{meterUploadTypeData.find((data) => data.value === (rowData as IMeter).meterUploadType)?.label}</label>}
					</Cell>
				</Column>
				<Column width={200}>
					<HeaderCell>Serial No.</HeaderCell>
					<Cell dataKey="serialNumber" />
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
								<IconButton icon={<EditIcon />} appearance="subtle" color="blue" onClick={() => onHandleEdit(rowData as IMeter)} />
								<IconButton icon={<DeleteIcon />} appearance="subtle" color="red" onClick={() => onHandleDelete(rowData as IMeter)} />
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
