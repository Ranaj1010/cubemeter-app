import IMeter from "@/models/meter";
import { Icon } from "@rsuite/icons";
import { MdOutlineElectricMeter } from "react-icons/md";
import { Button, Header, Panel, Stack } from "rsuite";
import { meterTypeData, meterUploadTypeData } from "../../meters/entry/data";
interface ITenantPropertyItem {
	label: string;
	value: string;
}

export const TenantPropertyItem = (props: ITenantPropertyItem) => {
	const { label, value } = props;
	return (
		<Stack direction="row" alignItems="flex-start" spacing={5}>
			<label>{label}:</label>
			<label style={{ color: "dodgerblue" }}>{value !== "" ? value : "----"}</label>
		</Stack>
	);
};

interface ITenantMeterGridViewProps {
	meters: IMeter[];
	onHandleView: (meter: IMeter) => void;
}

export const TenantMeterGridView = (props: ITenantMeterGridViewProps) => {
	const { meters, onHandleView } = props;

	return (
		<Stack wrap spacing={20}>
			{!meters.length && <label style={{ marginTop: "30px" }}>No meters found.</label>}
			{meters.length > 0 &&
				meters.map((meter) => (
					<Panel style={{ minWidth: 500 }} bordered key={meter.id}>
						<Stack spacing={10} alignItems="flex-start">
							<Icon as={MdOutlineElectricMeter} style={{ fontSize: 50 }} />
							<Stack direction="column" spacing={5} alignItems="flex-start">
								<Button style={{ marginBottom: "20px", padding: "0px" }} appearance="link" onClick={() => onHandleView(meter)}>
									<Header as="h3">#{meter.serialNumber}</Header>
								</Button>
								<TenantPropertyItem
									label="Model"
									value={meterUploadTypeData.find((data) => data.value === meter.meterUploadType)?.label as string}
								/>
								<TenantPropertyItem
									label="Type"
									value={meterTypeData.find((data) => data.value === meter.meterType)?.label as string}
								/>
							</Stack>
						</Stack>
					</Panel>
				))}
		</Stack>
	);
};
