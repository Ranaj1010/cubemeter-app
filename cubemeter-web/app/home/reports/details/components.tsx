import IMeter from "@/models/meter";
import { Icon } from "@rsuite/icons";
import { MdOutlineElectricMeter } from "react-icons/md";
import { Header, Panel, Stack } from "rsuite";
import { meterTypeData, meterUploadTypeData } from "../../meters/entry/data";
interface IMeterPropertyItem {
	label: string;
	value: string;
}

export const MeterPropertyItem = (props: IMeterPropertyItem) => {
	const { label, value } = props;
	return (
		<Stack direction="row" alignItems="flex-start" spacing={5}>
			<label>{label}:</label>
			<label style={{ color: "dodgerblue" }}>{value !== "" ? value : "----"}</label>
		</Stack>
	);
};

interface IMeterMeterGridViewProps {
	meters: IMeter[];
}

export const MeterMeterGridView = (props: IMeterMeterGridViewProps) => {
	const { meters } = props;

	return (
		<Stack wrap spacing={20}>
			{!meters.length && <label style={{ marginTop: "30px" }}>No meters found.</label>}
			{meters.length > 0 &&
				meters.map((meter) => (
					<Panel style={{ minWidth: 500 }} bordered key={meter.id}>
						<Stack spacing={20} alignItems="flex-start">
							<Icon as={MdOutlineElectricMeter} style={{ fontSize: 50 }} />
							<Stack direction="column" spacing={5} alignItems="flex-start">
								<Header as="h2">{meter.name}</Header>
								<MeterPropertyItem label="Serial Number" value={meter.serialNumber} />
								<MeterPropertyItem
									label="Model"
									value={meterUploadTypeData.find((data) => data.value === meter.meterUploadType)?.label as string}
								/>
								<MeterPropertyItem
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
