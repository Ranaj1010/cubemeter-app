import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export const nameRule = StringType().isRequired("Name is required.");
export const placeIdRule = StringType().isRequired("Place is required.");
export const unitIdRule = StringType().isRequired("Unit Id is required.");
export const serialNumberRule = StringType().isRequired("Serial Number is required.");
export const buildingNumberRule = StringType().isRequired("Building Number is required.");
export const gatewayRule = StringType().isRequired("Gateway is required.");
