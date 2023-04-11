import { IMeterTypeEnums, IMeterUploadTypeEnums } from "@/utilities/enums";
import { IBaseModel } from "./base";

interface IMeter extends IBaseModel {
	name: string;
	tenantId: number;
	meterType: IMeterTypeEnums;
	meterUploadType: IMeterUploadTypeEnums;
	ratio: string;
	remarks: string;
	sortNumber: number;
}

export default IMeter;
