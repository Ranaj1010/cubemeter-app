import IMeter from "@/models/meter";
import { useMachine } from "@xstate/react";
import ReactEcharts from "echarts-for-react";
import { useEffect } from "react";
import { Badge, Header, Panel, Stack } from "rsuite";
import { IRawMeterReading } from "./interface";
import MeterChartMonitoringMachine from "./machine";
interface IMeterChartMonitoringProps {
	meter: IMeter;
}
const MeterChartMonitoring = (props: IMeterChartMonitoringProps) => {
	const { meter } = props;
	const [current, send] = useMachine(MeterChartMonitoringMachine);
	const currentOption = {
		title: {
			text: "Current",
		},
		tooltip: {
			formatter: "Current: {c}",
		},
		series: [
			{
				name: "Data",
				type: "gauge",
				progress: {
					show: true,
				},
				detail: {
					valueAnimation: true,
					formatter: "{value}",
				},
				data: [
					{
						value: current.context.readings.length ? current.context.readings[0].current : 0,
						name: "Current",
					},
				],
			},
		],
	};

	const kilowattHourOption = {
		title: {
			text: "Kilowatt Hour",
		},
		tooltip: {
			formatter: "{c} kWh",
		},
		series: [
			{
				name: "Data",
				type: "gauge",
				progress: {
					show: true,
				},
				detail: {
					valueAnimation: true,
					formatter: "{value}",
				},
				data: [
					{
						value: current.context.readings.length ? current.context.readings[0].kilowatthour : 0,
						name: "kWh",
					},
				],
			},
		],
	};

	const kilowattOption = {
		title: {
			text: "Kilowatt",
		},
		tooltip: {
			trigger: "axis",
			formatter: function (params: any) {
				params = params[0];
				var date = new Date(params.value);
				return params.name + params.value[1] + " kW";
			},
			axisPointer: {
				animation: false,
			},
		},

		xAxis: {
			type: "time",
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			type: "value",
			boundaryGap: [0, "100%"],
			splitLine: {
				show: true,
			},
		},
		series: [
			{
				name: "Kilowatt Data",
				type: "line",
				showSymbol: false,
				data: current.context.historicalReadings.map((reading) => {
					return {
						name: reading.timeStamp,
						value: [reading.timeStamp, reading.kilowatt],
					};
				}),
			},
		],
	};

	const voltageOption = {
		title: {
			text: "Voltage",
		},
		tooltip: {
			trigger: "axis",
			formatter: function (params: any) {
				params = params[0];
				var date = new Date(params.value);
				return params.name + params.value[1] + "V";
			},
			axisPointer: {
				animation: true,
			},
		},

		xAxis: {
			type: "time",
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			type: "value",
			boundaryGap: [0, "100%"],
			splitLine: {
				show: true,
			},
		},
		series: [
			{
				name: "Voltage Data",
				type: "line",
				showSymbol: false,
				data: current.context.historicalReadings.map((reading) => {
					return {
						name: reading.timeStamp,
						value: [reading.timeStamp, reading.voltage],
					};
				}),
			},
		],
	};
	useEffect(() => {
		if (current.matches("connected")) {
			send("DISCONNECT");
		}

		if (meter != null) {
			send({ type: "CONNECT", payload: meter });
		}
	}, [meter]);

	useEffect(() => {
		let client = current.context.mqttClient;
		if (current.matches("connected")) {
			client.on("message", (topic, value) => {
				console.log(value.toString());
				let parsedReading = JSON.parse(value.toString());
				let rawReading: IRawMeterReading = {
					timeStamp: new Date(),
					voltage: Number.parseFloat(parsedReading.voltage),
					kilowatt: Number.parseFloat(parsedReading.kilowatt),
					kilowatthour: Number.parseFloat(parsedReading.kilowatthour),
					current: Number.parseFloat(parsedReading.current),
				};
				if (topic == `${current.context.meter!.tenant?.gateway}/${current.context.meter!.id}`) {
					send({ type: "UPDATE", payload: rawReading });
				}
			});
		}
	}, [current, current.value]);

	return (
		<Stack spacing={20} alignItems="flex-start" direction="column">
			<Stack spacing={10}>
				<Badge />
				<Header as="h5">Live</Header>
			</Stack>
			<Stack wrap spacing={20}>
				<Panel bordered style={{ width: "500px", height: "300px" }}>
					<ReactEcharts showLoading={current.matches("connecting")} option={currentOption} />
				</Panel>
				<Panel bordered style={{ width: "800px", height: "300px" }}>
					<ReactEcharts showLoading={current.matches("connecting")} option={kilowattOption} />
				</Panel>
				<Panel bordered style={{ width: "800px", height: "300px" }}>
					<ReactEcharts showLoading={current.matches("connecting")} option={voltageOption} />
				</Panel>
				<Panel bordered style={{ width: "500px", height: "300px" }}>
					<ReactEcharts showLoading={current.matches("connecting")} option={kilowattHourOption} />
				</Panel>
			</Stack>
		</Stack>
	);
};

export default MeterChartMonitoring;
