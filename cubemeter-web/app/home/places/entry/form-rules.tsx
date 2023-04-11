import { Schema } from "rsuite";
const { StringType, NumberType } = Schema.Types;

export const nameRule = StringType().isRequired("Name is required.");
export const timezoneRule = StringType().isRequired("Timezone is required.");
export const countryRule = StringType().isRequired("Country is required.");
export const regionRule = StringType().isRequired("Region is required.");
export const cityRule = StringType().isRequired("City is required.");
export const addressRule = StringType().isRequired("Address is required.");
