"use client";

import { IMeterTypeEnums, IMeterUploadTypeEnums } from "@/utilities/enums";
import { ItemDataType } from "rsuite/esm/@types/common";

export const meterTypeData: ItemDataType[] = [
	{
		label: "Single Phase",
		value: IMeterTypeEnums.SinglePhase,
	},
	{
		label: "Three Single Phase",
		value: IMeterTypeEnums.ThreePhase,
	},
	{
		label: "PRA1",
		value: IMeterTypeEnums.PRA1,
	},
	{
		label: "PRA2",
		value: IMeterTypeEnums.PRA2,
	},
	{
		label: "PRA3",
		value: IMeterTypeEnums.PRA3,
	},
];

export const meterUploadTypeData: ItemDataType[] = [
	{
		label: "IMeter",
		value: IMeterUploadTypeEnums.IMeter,
	},
	{
		label: "ModBus",
		value: IMeterUploadTypeEnums.ModBus,
	},
];

const ctRatioData = [
	"Default",
	"100:5",
	"150:5",
	"200:5",
	"250:5",
	"300:5",
	"400:5",
	"500:5",
	"600:5",
	"750:5",
	"800:5",
	"1500:5",
	"1600:5",
	"2000:5",
	"2500:5",
	"3000:5",
	"5000:5",
];
export const ctRatioTypeData: ItemDataType[] = ctRatioData.map((item) => ({
	label: item,
	value: item,
}));
