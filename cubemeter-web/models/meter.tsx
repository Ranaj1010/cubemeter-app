import { IMeterTypeEnums, IMeterUploadTypeEnums } from "@/utilities/enums";
import { IBaseModel } from "./base";
import ITenant from "./tenant";

interface IMeter extends IBaseModel {
	name: string;
	tenantId: number;
	tenant?: ITenant;
	meterType: IMeterTypeEnums;
	meterUploadType: IMeterUploadTypeEnums;
	ratio: string;
	remarks: string;
	sortNumber: number;
	serialNumber: string;
}

export default IMeter;
