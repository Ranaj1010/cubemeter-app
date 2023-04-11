import ITieredRate from "@/models/tiered-rate";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import { IconButton, InputNumber, Stack, Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

//#region TieredRate
export interface ITieredRateComponentProps {
	tieredRates: ITieredRate[];
	onAddItem: (tieredRate: ITieredRate) => void;
}
export const TieredRateComponent = (props: ITieredRateComponentProps) => {
	const { tieredRates, onAddItem } = props;
	return (
		<Stack direction="column" alignItems="flex-start" spacing={20}>
			<Table
				width={700}
				autoHeight
				data={tieredRates}
				onRowClick={(rowData) => {
					console.log(rowData);
				}}
			>
				<Column width={100}>
					<HeaderCell>Id</HeaderCell>
					<Cell dataKey="id" />
				</Column>
				<Column width={1200} flexGrow={2}>
					<HeaderCell>Description</HeaderCell>
					<Cell dataKey="description" />
				</Column>
				<Column width={20} flexGrow={1}>
					<HeaderCell>Value</HeaderCell>
					<Cell style={{ padding: "5px" }} dataKey="value">
						{(rowData) => <InputNumber placeholder="Enter Value" value={0} />}
					</Cell>
				</Column>
				<Column width={20} flexGrow={1}>
					<HeaderCell>Price</HeaderCell>
					<Cell style={{ padding: "5px" }} dataKey="price">
						{(rowData) => <InputNumber placeholder="Enter Price" value={0} />}
					</Cell>
				</Column>
			</Table>
			<IconButton icon={<AddOutlineIcon />} size="xs" appearance="primary" />
		</Stack>
	);
};
//#endregion

//#region ReviewAndConfirmItem
interface IReviewAndConfirmItemProps {
	label: string;
	value: string;
}
export const ReviewAndConfirmItem = (props: IReviewAndConfirmItemProps) => {
	const { label, value } = props;
	return (
		<Stack direction="row" alignItems="flex-start" spacing={5}>
			<label>{label}:</label>
			<label style={{ color: "dodgerblue" }}>{value !== "" ? value : "----"}</label>
		</Stack>
	);
};
//#endregion
