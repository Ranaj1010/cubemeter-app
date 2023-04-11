"use client";

import ITieredRate from "@/models/tiered-rate";
import countries from "../../../../data/countries.json";
import currencies from "../../../../data/currencies.json";
import timezones from "../../../../data/timezones.json";

export const timeZoneData = timezones.map((item) => ({
	label: item.text,
	value: item.text,
}));

export const countriesData = countries.map((item) => ({
	label: item.countryName,
	value: item.countryCode,
}));

export const currenciesData = currencies.map((item) => ({
	label: `${item.name} - ${item.symbol}`,
	value: item.code,
}));

export const billingDays: number[] = Array(28)
	.fill(28)
	.map((_, i) => i + 1);

export const billingDayData = billingDays.map((item) => ({
	label: item.toString(),
	value: item,
}));

export const mockTieredRates: ITieredRate[] = [
	{
		id: 1,
		placeId: 1,
		description: "Monthly electricity consumption >",
		value: 0,
		price: 0.8,
	},
	{
		id: 2,
		placeId: 1,
		description: "Monthly electricity consumption >",
		value: 0,
		price: 0.8,
	},
];
