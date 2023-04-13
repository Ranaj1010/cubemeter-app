import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export const nameRule = StringType().isRequired("Name is required.");
export const tenantIdRule = StringType().isRequired("Tenant is required.");
export const meterTypeRule = NumberType().isRequired("Type is required.");
export const meterUploadTypeRule = NumberType().isRequired("Upload Type is required.");
export const ratioRule = StringType().isRequired("Ratio is required.");
export const serialNumberRule = StringType().isRequired("Serial Number is required.");
