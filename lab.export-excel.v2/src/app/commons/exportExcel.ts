import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export const ExportExcel = async (templatePath: string, dataForExport: any, colForExport: any, listCellValue?: any, sheetName?: any, fileNameExport?: any): Promise<void> => {

    try {
        if (!templatePath || !dataForExport || !colForExport) {
            throw new Error('Missing required parameter');
        }

        /**
         * Xử lý đọc file excel
         */
        const response = await fetch(templatePath);

        // kiểm tra file template được đọc có tồn tại hay ko
        if (!response.ok) {
            throw new Error('Failed to fetch template file');
        }
        const file = await response.blob();

        // convert file
        const workbook = new Workbook();
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async (e) => {
            const arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
                await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            const worksheet = workbook.getWorksheet(`${sheetName ?? 'Sheet1'}`);

            /**
             * Xử lý gán giá trị vào các ô rời
             */
            listCellValue?.forEach((item: any) => {
                worksheet.getCell(item.cell).value = item.value;
            })

            // tổng số dòng ban đầu có trong file
            const defaultTotalRow = worksheet.rowCount + 1;

            /**
             * Ghi data vào excel
            */
            dataForExport.forEach((item: any, rowIndex: any) => {
                worksheet.getCell(defaultTotalRow + rowIndex, 1).value = rowIndex + 1;
                colForExport.forEach((colName: any, colIndex: any) => {
                    const colNameLower = colName.charAt(0).toLowerCase() + colName.slice(1); // lowercase first chart
                    worksheet.getCell(defaultTotalRow + rowIndex, colIndex + 2).value = item[colNameLower];  // bđ đổ data từ cột thứ 2 trong excel
                });
            });

            /**
             * Xuất file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                fs.saveAs(blob, `${fileNameExport ?? 'export'}.xlsx`);
            });
        }
    } catch (error: any) {
        throw new Error(error);
    }
}

