import * as FileSaver from "file-saver";
import XSLX from "sheetjs-style";

interface IExportToExcelProps {
	rawData: any;
	fileName: string;
}

const ExportToExcel = (props: IExportToExcelProps) => {
	const { rawData, fileName } = props;
	const fileType = "application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	const ws = XSLX.utils.json_to_sheet(rawData);
	const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
	const excelBuffer = XSLX.write(wb, { bookType: "xlsx", type: "array" });
	const data = new Blob([excelBuffer], { type: fileType });
	FileSaver.saveAs(data, fileName + fileExtension);
};

export default ExportToExcel;
