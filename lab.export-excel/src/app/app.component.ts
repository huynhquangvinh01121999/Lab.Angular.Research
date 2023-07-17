import { Component } from '@angular/core';
import { Employee, Employees } from './models/Employees';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { NhanVien, NhanViens } from './models/NhanVien';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  employees: Employee[] = Employees
  nhanviens: NhanVien[] = NhanViens

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  // note: ok
  async exportToExcel(): Promise<void> {

    // khoi tao workbook
    let workbook = new Workbook();

    // cau hinh ten sheet
    let worksheet = workbook.addWorksheet('sheet');

    /** 
     * Start config column header
    */
    worksheet.columns = [
      { header: 'STT', key: 'Stt', width: 10 },
      { header: 'Mã nhân viên', key: 'MaNhanVien', width: 32 },
      { header: ['Thông tin nghỉ phép', 'Giờ vào'], key: 'GioVao', width: 32 },
      { header: ['Thông tin nghỉ phép', 'Giờ ra'], key: 'GioRa', width: 32 },
      { header: 'Tổng nghỉ', key: 'TongNghi', width: 32 },
    ];

    // merge cell
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:D1');
    worksheet.mergeCells('E1:E2');
    /** 
     * End config column header
    */

    /** 
     * Start config column header đối với 3 hàng có chung 1 parent
    */
    // worksheet.columns = [
    //   { header: 'STT', key: 'Stt', width: 10 },
    //   { header: 'Mã nhân viên', key: 'MaNhanVien', width: 32 },

    //   { header: ['Thông tin nghỉ phép', 'Giờ vào', "Giờ"], key: 'GioVao', width: 32 },
    //   { header: ['Thông tin nghỉ phép', 'Giờ vào', "Phút"], key: 'PhutVao', width: 32 },
    //   { header: ['Thông tin nghỉ phép', 'Giờ ra', "Giờ"], key: 'GioRa', width: 32 },
    //   { header: ['Thông tin nghỉ phép', 'Giờ ra', "Phút"], key: 'PhutRa', width: 32 },
    //   { header: 'Tổng nghỉ', key: 'TongNghi', width: 32 },
    // ];
    // worksheet.mergeCells('A1:A3');
    // worksheet.mergeCells('B1:B3');
    // worksheet.mergeCells('C1:F1');
    // worksheet.mergeCells('C2:D2');
    // worksheet.mergeCells('E2:F2');
    // worksheet.mergeCells('G1:G3');
    /** 
     * End config column header
    */

    for (var i = 1; i <= worksheet.rowCount; i++) {
      for (var j = 1; j <= worksheet.columnCount; j++) {

        // set font cho header
        worksheet.getCell(i, j).font = {
          name: 'Times New Roman',
          color: { argb: '#000000' },
          family: 2,
          size: 10,
          //italic: false,
          bold: true
        };

        // set background color cho header
        worksheet.getCell(i, j).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }
        };
      }
    }

    // them du lieu vao sheet
    //worksheet.addRow(this.employees, "n");
    this.employees.forEach(e => {
      worksheet.addRow({ Stt: e.Stt, MaNhanVien: e.MaNhanVien, GioVao: e.GioVao, GioRa: e.GioRa, TongNghi: e.TongNghi });

      // worksheet.addRow({
      //   Stt: e.Stt, MaNhanVien: e.MaNhanVien
      //   , GioVao: e.GioVao.split(":")[0]
      //   , PhutVao: e.GioVao.split(":")[1]
      //   , GioRa: e.GioRa.split(":")[0]
      //   , PhutRa: e.GioRa.split(":")[1]
      //   , TongNghi: e.TongNghi
      // }, "n");
    });

    for (var i = 1; i <= worksheet.rowCount; i++) {
      for (var j = 1; j <= worksheet.columnCount; j++) {

        // set alginment cell
        worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center' };

        // set border cell
        worksheet.getCell(i, j).border = {
          top: { style: 'thin', color: { argb: '#000000' } },
          left: { style: 'thin', color: { argb: '#000000' } },
          bottom: { style: 'thin', color: { argb: '#000000' } },
          right: { style: 'thin', color: { argb: '#000000' } }
        };
      }
    }

    await workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Employees.xlsx');
    })
  }

  configWorkSheet(sheetName?: string): Worksheet {

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(sheetName);

    return worksheet;
  }

  async writeToExcel(workbook: Workbook, fileName: string): Promise<void> {
    await workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fileName}.xlsx`);
    })
  }

  // note: dang gap bug
  readFileExcel(fileName: string): void {
    this.httpClient.get(fileName, { responseType: 'blob' })
      .subscribe((data) => {
        const reader: FileReader = new FileReader();

        let dataJson1;
        let dataJson2;

        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab first sheet */
          // const wsname: string = wb.SheetNames[1];
          // const ws: XLSX.WorkSheet = wb.Sheets[wsname];



          /* save data */
          // dataJson1 = XLSX.utils.sheet_to_json(ws1);
          // console.log(dataJson1);

        };
        reader.readAsBinaryString(data);
      })
  }

  // note: ok
  readFileExcel_v2(): void {
    this.httpClient.get('assets/ExcelTemplates/Export1.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const reader: FileReader = new FileReader();
        var workbook = new Workbook();

        reader.onload = (e: any) => {
          const bstr = e.target.result as ArrayBuffer;
          workbook.xlsx.load(bstr).then(async (wb) => {
            let worksheet = workbook.getWorksheet('Sheet1');
            let rowNumber = worksheet.rowCount + 1;

            this.employees.forEach(e => {
              worksheet.getCell(rowNumber, 1).value = e.Stt
              worksheet.getCell(rowNumber, 2).value = e.MaNhanVien
              worksheet.getCell(rowNumber, 3).value = e.GioVao
              worksheet.getCell(rowNumber, 4).value = e.GioRa
              worksheet.getCell(rowNumber, 5).value = e.TongNghi
              rowNumber += 1;
            });

            for (var i = 1; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center' };

                // set border cell
                worksheet.getCell(i, j).border = {
                  top: { style: 'thin', color: { argb: '#000000' } },
                  left: { style: 'thin', color: { argb: '#000000' } },
                  bottom: { style: 'thin', color: { argb: '#000000' } },
                  right: { style: 'thin', color: { argb: '#000000' } }
                };
              }
            }

            workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, 'Final.xlsx');
            });
          }).catch((error) => {
            console.log("readFile fail", error);
          })

        };
        reader.readAsBinaryString(data);
      })
  }

  // note: ok
  async readFileExcel_v3(): Promise<void> {

    this.httpClient.get('assets/ExcelTemplates/Export1.xlsx', { responseType: 'blob' })
      .subscribe((file: Blob) => {

        const workbook = new Workbook();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async (e) => {
          let arrayBuffer = fileReader.result as ArrayBuffer;
          console.log(arrayBuffer);


          if (arrayBuffer)
            await workbook.xlsx.load(arrayBuffer);

          let worksheet = workbook.getWorksheet('Sheet1');

          let rowNumber = worksheet.rowCount + 1;

          this.employees.forEach(e => {
            worksheet.getCell(rowNumber, 1).value = e.Stt
            worksheet.getCell(rowNumber, 2).value = e.MaNhanVien
            worksheet.getCell(rowNumber, 3).value = e.GioVao
            worksheet.getCell(rowNumber, 4).value = e.GioRa
            worksheet.getCell(rowNumber, 5).value = e.TongNghi
            rowNumber += 1;
          });

          for (var i = 1; i <= worksheet.rowCount; i++) {
            for (var j = 1; j <= worksheet.columnCount; j++) {

              // set alginment cell
              worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center' };

              // set border cell
              worksheet.getCell(i, j).border = {
                top: { style: 'thin', color: { argb: '#000000' } },
                left: { style: 'thin', color: { argb: '#000000' } },
                bottom: { style: 'thin', color: { argb: '#000000' } },
                right: { style: 'thin', color: { argb: '#000000' } }
              };
            }
          }


          workbook.xlsx.writeBuffer().then((data: any) => {
            let blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, 'Final.xlsx');
          });
        }
      })
  }

  // note: final
  async exportExcel(fileName: string, sheetName: string, fileNameExport?: string): Promise<void> {

    this.httpClient.get(`assets/ExcelTemplates/${fileName}`, { responseType: 'blob' })
      .subscribe((file: Blob) => {

        const workbook = new Workbook();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async (e) => {
          let arrayBuffer = fileReader.result as ArrayBuffer;

          if (arrayBuffer)
            await workbook.xlsx.load(arrayBuffer);

          let worksheet = workbook.getWorksheet(sheetName);

          const rowNumberDefault = worksheet.rowCount;

          /**
           * Bat dau: set font chu cho tieu de table header
           */
          for (var i = 1; i <= worksheet.rowCount; i++) {
            for (var j = 1; j <= worksheet.columnCount; j++) {
              worksheet.getCell(i, j).font = {
                name: 'Times New Roman',
                color: { argb: '#000000' },
                family: 2,
                size: 13,
                bold: true
              };
            }
          }
          /**
           * Ket thuc
           */


          /** 
           * Bat dau: Xu ly insert tung row data vao sheet excel
           */
          // dem so luong row ban dau cua sheet
          let rowNumber = worksheet.rowCount + 1;

          // lay ra ds cac key cua 1 object
          var arrObjNhanVien = Object.keys(NhanViens[0])

          // insert row data
          this.nhanviens.forEach((nv: any) => {
            arrObjNhanVien.forEach((key, index) => {
              worksheet.getCell(rowNumber, index + 1).value = nv[key]
            })
            rowNumber += 1;
          });
          /** 
           * Ket thuc: Hoan tat qua trinh insert
           */

          /**
           * Bat dau: cau hinh width, alignment, boder,...
           */
          for (var i = 1; i <= worksheet.rowCount; i++) {
            for (var j = 1; j <= worksheet.columnCount; j++) {

              // set with column
              worksheet.getColumn(j).width = 20;

              // set alginment cell
              worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center' };


              // set border cell
              worksheet.getCell(i, j).border = {
                top: { style: 'thin', color: { argb: '#000000' } },
                left: { style: 'thin', color: { argb: '#000000' } },
                bottom: { style: 'thin', color: { argb: '#000000' } },
                right: { style: 'thin', color: { argb: '#000000' } }
              };
            }
          }
          /**
           * Ket thuc
           */

          // set wrap text
          for (var i = rowNumberDefault; i <= worksheet.rowCount; i++) {
            for (var j = 1; j <= worksheet.columnCount; j++) {
              worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
          }

          /**
           * Bat dau: Ghi file excel
           */
          await workbook.xlsx.writeBuffer().then((data: any) => {
            let blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
          });
          /**
           * Ket thuc
           */
        }
      })
  }
}
