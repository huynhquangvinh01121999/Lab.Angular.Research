import { Component } from '@angular/core';
import { Workbook } from 'exceljs';
import * as XLSX from "xlsx"
import * as fs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { TongHopNgayCong, ViecBenNgoai, viecbenngoai } from "./models/TongHopNgayCong";
import { ExportExcel } from './commons/exportExcel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  fileToUpload: any;

  isCollapsed = false;
  tongHopNgayCongs: TongHopNgayCong[] = []
  bgCuoiTuan: string = 'fff3cd'
  bgNgayLe: string = '91d5ff'

  constructor(private httpClient: HttpClient) { }

  ngOnInit() { }

  fnGetTongHopNgayCong() {
    return new Promise<TongHopNgayCong[]>((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/TongHopDuLieu/ExportTongHopNgayCong`;
      var params = {
        nhanVienId: "8EF9AD6D-2495-4909-A291-36426440BE43",
        thang: 12,
        nam: 2022
      }
      this.httpClient.get(apiURL, { params: params })
        .toPromise()
        .then(
          (res: any) => {
            console.log(res);

            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async fetchData(): Promise<void> {
    var result = await this.fnGetTongHopNgayCong();
    console.log(result);
  }

  // note: final
  async exportExcel(fileName: string, sheetName: string, fileNameExport?: string): Promise<void> {

    // đọc file template export
    this.httpClient.get(`assets/ExcelTemplates/${fileName}`, { responseType: 'blob' })
      .subscribe((file: Blob) => {

        var params = {
          nhanVienId: "8EF9AD6D-2495-4909-A291-36426440BE43",
          thang: 12,
          nam: 2022
        }

        // get data từ api
        this.httpClient.get('http://localhost:5000/api/v1/TongHopDuLieu/ExportTongHopNgayCong', { params: params })
          // this.httpClient.get('/assets/data.json')
          .subscribe((x: any) => {

            this.tongHopNgayCongs = x.data;

            // xử lý file template sang obj Workbook 
            const workbook = new Workbook();
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = async (e) => {
              let arrayBuffer = fileReader.result as ArrayBuffer;

              if (arrayBuffer)
                await workbook.xlsx.load(arrayBuffer);

              // lấy ra sheet cần xử lý
              let worksheet = workbook.getWorksheet(sheetName);

              let defaultTotalCol = worksheet.columnCount; // tổng số cột ban đầu
              let rowNumber = worksheet.rowCount + 1; // tổng số dòng ban đầu (dòng insert dữ liệu mới = tổng dòng ban đầu + 1)

              var arrObjThdl = Object.keys(this.tongHopNgayCongs[0])  // đọc các key của object TongHopNgayCong
              var arrObjViecBenNgoai = Object.keys(viecbenngoai) // đọc các key của object ViecBenNgoai

              // insert row data
              this.tongHopNgayCongs.forEach((item: any) => {
                var colNumber = 1;
                var flag = 1;

                var vbn: ViecBenNgoai[] = item['viecBenNgoais']

                if (vbn) {  // trường hợp vbn != null
                  // Xử lý merge cells
                  if (vbn.length > 1) {
                    for (var i = 1; i <= defaultTotalCol; i++) {
                      flag = i;
                      // khi đến vị trí của cột 'viecbenngoai' thì sẽ không merge
                      // nhảy đến vị trí của cột phía sau cột 'viecbenngoai'
                      if (i > arrObjThdl.indexOf('viecBenNgoais')) {
                        flag += arrObjViecBenNgoai.length
                      }
                      worksheet.mergeCells(rowNumber, flag, rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1), flag)
                    }
                  }

                  // code này đã được tối ưu ở trên
                  // for (var i = 1; i <= defaultTotalCol; i++) {
                  //   flag = i;
                  //   // khi đến vị trí của cột 'viecbenngoai' thì sẽ không merge
                  //   // nhảy đến vị trí của cột phía sau cột 'viecbenngoai'
                  //   if (i > arrObjThdl.indexOf('viecBenNgoais')) {
                  //     flag += arrObjViecBenNgoai.length
                  //   }

                  //   if (vbn.length > 1) {
                  //     //worksheet.mergeCells(`A${rowNumber}:A${rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1)}`);
                  //     worksheet.mergeCells(rowNumber, flag, rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1), flag)
                  //   }
                  // }

                  var curLoopRow = rowNumber
                  for (var i = 0; i < vbn.length; i++) {
                    arrObjThdl.forEach(key => {

                      // set value cho các cell của viecbenngoai
                      // loop viecbenngoai và insert row
                      if (key == 'viecBenNgoais') {
                        var vbnTemp: any = vbn[i]
                        arrObjViecBenNgoai.forEach((key, idx) => {
                          worksheet.getCell(curLoopRow, colNumber + idx).value = vbnTemp[key]
                        })
                        colNumber += arrObjViecBenNgoai.length
                      } else {
                        // format date ở cột 'ngày'
                        if (key === 'ngay') {
                          worksheet.getCell(curLoopRow, colNumber).value = item[key].split("T")[0]
                        } else {
                          worksheet.getCell(curLoopRow, colNumber).value = item[key]
                        }
                        colNumber += 1
                      }
                    })
                    colNumber = 1;
                    curLoopRow++;
                  }
                } else {  // trường hợp vbn = null
                  arrObjThdl.forEach(key => {
                    // khi gặp key 'viecbenngoais' sẽ tăng col lên theo số lượng field của đối tượng viecbenngoai
                    if (key == 'viecBenNgoais') {
                      colNumber += arrObjViecBenNgoai.length
                    } else {
                      // format date ở cột 'ngày'
                      if (key === 'ngay') {
                        worksheet.getCell(rowNumber, colNumber).value = item[key].split("T")[0]
                      } else {
                        worksheet.getCell(rowNumber, colNumber).value = item[key]
                      }
                      colNumber += 1
                    }
                  })
                }

                rowNumber += (vbn ? (vbn.length) : 1);
              });

              /**
               * Format cell
              */
              for (var i = 1; i <= worksheet.rowCount; i++) {
                for (var j = 1; j <= worksheet.columnCount; j++) {

                  // set alginment cell
                  // worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
               * Ghi file excel
               */
              await workbook.xlsx.writeBuffer().then((data: any) => {
                let blob = new Blob([data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
              });
            }
          })
      })
  }
  // note: final
  async exportExcel_v2(fileName: string, sheetName: string, fileNameExport?: string): Promise<void> {

    // get data từ api
    var result: TongHopNgayCong[] = await this.fnGetTongHopNgayCong();
    this.tongHopNgayCongs = result;

    // đọc file template export
    this.httpClient.get(`assets/ExcelTemplates/${fileName}`, { responseType: 'blob' })
      .subscribe((file: Blob) => {

        var params = {
          nhanVienId: "8EF9AD6D-2495-4909-A291-36426440BE43",
          thang: 12,
          nam: 2022
        }

        // xử lý file template sang obj Workbook 
        const workbook = new Workbook();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async (e) => {
          let arrayBuffer = fileReader.result as ArrayBuffer;

          if (arrayBuffer)
            await workbook.xlsx.load(arrayBuffer);

          // lấy ra sheet cần xử lý
          let worksheet = workbook.getWorksheet(sheetName);

          let defaultTotalCol = worksheet.columnCount; // tổng số cột ban đầu
          let rowNumber = worksheet.rowCount + 1; // tổng số dòng ban đầu (dòng insert dữ liệu mới = tổng dòng ban đầu + 1)

          var arrObjThdl = Object.keys(this.tongHopNgayCongs[0])  // đọc các key của object TongHopNgayCong
          var arrObjViecBenNgoai = Object.keys(viecbenngoai) // đọc các key của object ViecBenNgoai

          // insert row data
          this.tongHopNgayCongs.forEach((item: any) => {
            var colNumber = 1;
            var flag = 1;

            var vbn: ViecBenNgoai[] = item['viecBenNgoais']

            if (vbn) {  // trường hợp vbn != null
              // Xử lý merge cells
              if (vbn.length > 1) {
                for (var i = 1; i <= defaultTotalCol; i++) {
                  flag = i;
                  // khi đến vị trí của cột 'viecbenngoai' thì sẽ không merge
                  // nhảy đến vị trí của cột phía sau cột 'viecbenngoai'
                  if (i > arrObjThdl.indexOf('viecBenNgoais')) {
                    flag += arrObjViecBenNgoai.length
                  }
                  worksheet.mergeCells(rowNumber, flag, rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1), flag)
                }
              }

              // code này đã được tối ưu ở trên
              // for (var i = 1; i <= defaultTotalCol; i++) {
              //   flag = i;
              //   // khi đến vị trí của cột 'viecbenngoai' thì sẽ không merge
              //   // nhảy đến vị trí của cột phía sau cột 'viecbenngoai'
              //   if (i > arrObjThdl.indexOf('viecBenNgoais')) {
              //     flag += arrObjViecBenNgoai.length
              //   }

              //   if (vbn.length > 1) {
              //     //worksheet.mergeCells(`A${rowNumber}:A${rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1)}`);
              //     worksheet.mergeCells(rowNumber, flag, rowNumber + ((vbn.length == 1) ? 0 : vbn.length - 1), flag)
              //   }
              // }

              var curLoopRow = rowNumber
              for (var i = 0; i < vbn.length; i++) {
                arrObjThdl.forEach(key => {

                  // set value cho các cell của viecbenngoai
                  // loop viecbenngoai và insert row
                  if (key == 'viecBenNgoais') {
                    var vbnTemp: any = vbn[i]
                    arrObjViecBenNgoai.forEach((key, idx) => {
                      worksheet.getCell(curLoopRow, colNumber + idx).value = vbnTemp[key]
                    })
                    colNumber += arrObjViecBenNgoai.length
                  } else {
                    // format date ở cột 'ngày'
                    if (key === 'ngay') {
                      worksheet.getCell(curLoopRow, colNumber).value = item[key].split("T")[0]
                    } else {
                      worksheet.getCell(curLoopRow, colNumber).value = item[key]
                    }
                    colNumber += 1
                  }
                })
                colNumber = 1;
                curLoopRow++;
              }
            } else {  // trường hợp vbn = null
              arrObjThdl.forEach(key => {
                // khi gặp key 'viecbenngoais' sẽ tăng col lên theo số lượng field của đối tượng viecbenngoai
                if (key == 'viecBenNgoais') {
                  colNumber += arrObjViecBenNgoai.length
                } else {
                  // format date ở cột 'ngày'
                  if (key === 'ngay') {
                    worksheet.getCell(rowNumber, colNumber).value = item[key].split("T")[0]
                  } else {
                    worksheet.getCell(rowNumber, colNumber).value = item[key]
                  }
                  colNumber += 1
                }
              })
            }

            rowNumber += (vbn ? (vbn.length) : 1);
          });

          /**
           * Format cell
          */
          for (var i = 1; i <= worksheet.rowCount; i++) {
            for (var j = 1; j <= worksheet.columnCount; j++) {

              // set alginment cell
              // worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
           * Ghi file excel
           */
          await workbook.xlsx.writeBuffer().then((data: any) => {
            let blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
          });
        }
      })
  }

  // #region fnGetTongHopNgayCong_v3

  fnGetTongHopNgayCong_v3() {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/TongHopDuLieu/ExportTongHopNgayCong`;
      var params = {
        nhanVienId: "8EF9AD6D-2495-4909-A291-36426440BE43",
        // nhanVienId: "73BA8D59-0955-4468-8A4D-0EF589DA8F41",
        thang: 1,
        nam: 2023
      }
      this.httpClient.get(apiURL, { params: params })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportExcel_v3(tenNhanVien: string, maNhanVien: string, thoiGian: string, fileNameExport?: string): Promise<void> {

    // get data từ api
    var thNgayCongs: any = await this.fnGetTongHopNgayCong_v3();
    console.log(thNgayCongs);

    //new
    if (thNgayCongs) {

      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/templateExportData.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('Sheet1');

            // gán tên, mã nhân viên và thời gian
            worksheet.getCell('B1').value = tenNhanVien.toUpperCase()
            worksheet.getCell('B2').value = maNhanVien
            worksheet.getCell('E2').value = `THÁNG: ${thoiGian}`

            let defaultTotalCol = worksheet.columnCount; // tổng số cột ban đầu
            let defaultTotalRow = worksheet.rowCount + 1; // tổng số dòng ban đầu
            let rowNumber = worksheet.rowCount + 1; // tổng số dòng ban đầu (dòng insert dữ liệu mới = tổng dòng ban đầu + 1)

            var arrObjThdl = thNgayCongs.length > 0 ? Object.keys(thNgayCongs[0]) : []  // đọc các key của object TongHopNgayCong

            var sumRowVbn: number = 0
            // insert row data
            thNgayCongs.forEach((item: any) => {
              var colNumber = 1;

              var viecbenngoais = item['x_ViecBenNgoais']
              var vbenngoai = viecbenngoais ? Object.keys(viecbenngoais[0]) : []

              if (viecbenngoais) {  // trường hợp vbn != null
                // Xử lý merge cells
                if (viecbenngoais.length > 1) {
                  for (var i = 1; i <= defaultTotalCol; i++) {
                    // khi đến vị trí của cột 'viecbenngoai' thì sẽ không merge
                    if (i <= arrObjThdl.indexOf('x_ViecBenNgoais')) {
                      worksheet.mergeCells(rowNumber, i, rowNumber + ((viecbenngoais.length == 1) ? 0 : viecbenngoais.length - 1), i)
                    }
                  }
                }

                var curLoopRow = rowNumber
                for (var i = 0; i < viecbenngoais.length; i++) {
                  arrObjThdl.forEach(key => {

                    if (key == 'x_ViecBenNgoais') {
                      var vbnTemp: any = viecbenngoais[i]

                      // lay ra so cot hien tai
                      var colCurNumber = colNumber  // new

                      vbenngoai.forEach((key, idx) => {
                        worksheet.getCell(curLoopRow, colCurNumber + idx).value = vbnTemp[key]
                        colNumber += 1 // new
                      })
                    } else {
                      // format date ở cột 'ngày'
                      if (key === 'a_Ngay') {
                        worksheet.getCell(curLoopRow, colNumber).value = item[key].split("T")[0]
                      } else {
                        // new
                        // truong hop key ko phai 'y_isCuoiTuan' vs 'z_isNgayLe' thi gan gia tri
                        if (key != 'y_isCuoiTuan' && key != 'z_isNgayLe') {
                          worksheet.getCell(curLoopRow, colNumber).value = item[key]
                        }
                      }
                      colNumber += 1
                    }
                  })
                  colNumber = 1;
                  curLoopRow++;
                }
              } else {  // trường hợp vbn = null
                arrObjThdl.forEach(key => {
                  if (key === 'a_Ngay') {
                    worksheet.getCell(rowNumber, colNumber).value = item[key].split("T")[0]
                  } else {
                    // new
                    // truong hop key ko phai 'y_isCuoiTuan' vs 'z_isNgayLe' thi gan gia tri
                    if (key != 'y_isCuoiTuan' && key != 'z_isNgayLe') {
                      worksheet.getCell(rowNumber, colNumber).value = item[key]
                    }
                  }
                  colNumber += 1
                })
              }

              rowNumber += (viecbenngoais ? (viecbenngoais.length) : 1);

              // new
              // set background cho ngay cuoi tuan & ngay le
              sumRowVbn += (item['x_ViecBenNgoais'] && item['x_ViecBenNgoais'].length) > 1 ? item['x_ViecBenNgoais'].length : 1 // cong don so luong item trong danh sach vbn
              var curRowVbn = (item['x_ViecBenNgoais'] && item['x_ViecBenNgoais'].length) > 1 ? item['x_ViecBenNgoais'].length : 1  // get so luong item trong danh sach vbn hien tai - doi tuong dang dc loop

              // truong hop ngay cuoi tuan
              if (item['y_isCuoiTuan'] && !item['z_isNgayLe']) {
                // xu ly to mau background theo so dong tuong ung voi so luong item vbn cua doi tuong hien tai
                for (var i = 1; i <= curRowVbn; i++) {
                  for (var j = 1; j <= worksheet.columnCount; j++) {
                    worksheet.getCell(defaultTotalRow + sumRowVbn - i, j).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: this.bgCuoiTuan }
                    };
                  }
                }
              }

              // truong hop ngay le
              if (item['z_isNgayLe']) {
                // console.log(defaultTotalRow + sumRowVbn - 1);
                // xu ly to mau background theo so dong tuong ung voi so luong item vbn cua doi tuong hien tai
                for (var i = 1; i <= curRowVbn; i++) {
                  for (var j = 1; j <= worksheet.columnCount; j++) {
                    worksheet.getCell(defaultTotalRow + sumRowVbn - i, j).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: this.bgNgayLe }
                    };
                  }
                }
              }
            });

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                // worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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

            // new
            // set background cho ngay cuoi tuan & ngay le
            // var sumRowVbn: number = 0
            // thNgayCongs.forEach((item: any, idx: any) => {
            // sumRowVbn += (item['x_ViecBenNgoais'] && item['x_ViecBenNgoais'].length) > 1 ? item['x_ViecBenNgoais'].length : 1 // cong don so luong item trong danh sach vbn
            // var curRowVbn = (item['x_ViecBenNgoais'] && item['x_ViecBenNgoais'].length) > 1 ? item['x_ViecBenNgoais'].length : 1  // get so luong item trong danh sach vbn hien tai - doi tuong dang dc loop

            // // truong hop ngay cuoi tuan
            // if (item['y_isCuoiTuan'] && !item['z_isNgayLe']) {
            //   // xu ly to mau background theo so dong tuong ung voi so luong item vbn cua doi tuong hien tai
            //   for (var i = 1; i <= curRowVbn; i++) {
            //     for (var j = 1; j <= worksheet.columnCount; j++) {
            //       worksheet.getCell(defaultTotalRow + sumRowVbn - i, j).fill = {
            //         type: 'pattern',
            //         pattern: 'solid',
            //         fgColor: { argb: this.bgCuoiTuan }
            //       };
            //     }
            //   }
            // }

            // // truong hop ngay le
            // if (item['z_isNgayLe']) {
            //   // console.log(defaultTotalRow + sumRowVbn - 1);
            //   // xu ly to mau background theo so dong tuong ung voi so luong item vbn cua doi tuong hien tai
            //   for (var i = 1; i <= curRowVbn; i++) {
            //     for (var j = 1; j <= worksheet.columnCount; j++) {
            //       worksheet.getCell(defaultTotalRow + sumRowVbn - i, j).fill = {
            //         type: 'pattern',
            //         pattern: 'solid',
            //         fgColor: { argb: this.bgNgayLe }
            //       };
            //     }
            //   }
            // }
            // })

            /**
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  //#endregion

  // =================================================================================================

  // #region Export excel Quan ly ngay cong 

  fnGetQuanLyNgayCong() {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/TongHopDuLieu/QuanLyNgayCong`;
      var params = {
        Thang: "2022-12-01",
        PageSize: 9999
      }
      this.httpClient.get(apiURL, { params: params })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async expEx_QuanLyNgayCong(dataForExport: any, thoiGian: any, fileNameExport?: string): Promise<void> {
    // get data từ api
    var quanLyNgayCongs: any = await this.fnGetQuanLyNgayCong();
    console.log(quanLyNgayCongs);

    if (quanLyNgayCongs) {

      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/QuanLyNgayCongTemplate.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('Sheet1');

            // gán tên, mã nhân viên và thời gian
            worksheet.getCell('A2').value = `THÁNG: ${thoiGian}`

            let defaultTotalRow = worksheet.rowCount + 1; // tổng số dòng ban đầu

            quanLyNgayCongs.forEach((item: any, idx: any) => {
              worksheet.getCell(defaultTotalRow + idx, 1).value = idx + 1;
              worksheet.getCell(defaultTotalRow + idx, 2).value = item['maNhanVien'];
              worksheet.getCell(defaultTotalRow + idx, 3).value = item['hoTenDem'];
              worksheet.getCell(defaultTotalRow + idx, 4).value = item['ten'];
              worksheet.getCell(defaultTotalRow + idx, 5).value = item['tenPhong'];
              worksheet.getCell(defaultTotalRow + idx, 6).value = item['soNgayCong'];
              worksheet.getCell(defaultTotalRow + idx, 7).value = item['soNgayNghiLe'];
              worksheet.getCell(defaultTotalRow + idx, 8).value = item['soPhutDiTre'];
              worksheet.getCell(defaultTotalRow + idx, 9).value = item['soPhutVeSom'];
              worksheet.getCell(defaultTotalRow + idx, 10).value = item['soGioViecBenNgoai'];
              worksheet.getCell(defaultTotalRow + idx, 11).value = item['soNgayNghiPhepHopLe'];
              worksheet.getCell(defaultTotalRow + idx, 12).value = item['soNgayNghiPhepKhongHopLe'];
              worksheet.getCell(defaultTotalRow + idx, 13).value = item['soNgayCongThucTe'];
              worksheet.getCell(defaultTotalRow + idx, 14).value = item['soNgayCongThieu'];
            })

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                // worksheet.getCell(i, j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                worksheet.getCell(i, j).alignment = (j == 3 || j == 4) ? { vertical: 'middle', horizontal: 'left' } : { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(i, j).font = {
                  name: 'Times New Roman',
                  family: 2,
                  size: 12
                };

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
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  //#endregion

  // #region Export excel Nghỉ phép 

  fn_ThongKeNghiPhep(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/NghiPhep/ThongKeNghiPhep`;

      this.httpClient.get(apiURL, {
        params: {
          thoiGianBatDau: params.thoiGianBatDau,
          thoiGianKetThuc: params.thoiGianKetThuc
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportExcelNghiPhep(dataForExport: any, thoiGian: any, fileNameExport?: string): Promise<void> {

    if (dataForExport) {
      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/thongTinNghiPhep_20230220.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('NghiPhep');

            worksheet.getCell(2, 1).value = `THỜI GIAN: ${thoiGian.thoiGianBatDau} - ${thoiGian.thoiGianKetThuc}`;

            // tổng số dòng ban đầu
            let defaultTotalRow = worksheet.rowCount + 1;

            for (var i = 1; i <= dataForExport.length; i++) {

            }

            dataForExport.forEach((item: any, idx: any) => {
              worksheet.getCell(defaultTotalRow + idx, 1).value = idx + 1;
              worksheet.getCell(defaultTotalRow + idx, 2).value = item['maNhanVien'];
              worksheet.getCell(defaultTotalRow + idx, 3).value = item['hoTenDemVN'];
              worksheet.getCell(defaultTotalRow + idx, 4).value = item['tenVN'];
              worksheet.getCell(defaultTotalRow + idx, 5).value = item['phong'];
              worksheet.getCell(defaultTotalRow + idx, 6).value = item['thoiGianBatDau'];
              worksheet.getCell(defaultTotalRow + idx, 7).value = item['thoiGianKetThuc'];
              worksheet.getCell(defaultTotalRow + idx, 8).value = item['soNgayDangKy'];
              worksheet.getCell(defaultTotalRow + idx, 9).value = item['trangThaiNghi'];
              worksheet.getCell(defaultTotalRow + idx, 10).value = item['trangThaiDon'];
            })

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                worksheet.getCell(i, j).alignment = ((j >= 3 && j <= 5) || j == 9 || j == 10) ? { vertical: 'middle', horizontal: 'left' }
                  : (j == 8) ? { vertical: 'middle', horizontal: 'right' } : { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(i, j).font = {
                  name: 'Times New Roman',
                  family: 2,
                  size: 12
                };

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
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  async thongKeNghiPhep() {
    var params = {
      thoiGianBatDau: "2022-11-01",
      thoiGianKetThuc: '2023-01-01'
    }

    // get data từ api
    var nghiPheps: any = await this.fn_ThongKeNghiPhep(params);

    await this.exportExcelNghiPhep(nghiPheps, params)
  }

  // #endregion

  // #region Export excel Phụ cấp 

  fn_ThongKePhuCap(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/PhuCap/ThongKePhuCap`;

      this.httpClient.get(apiURL, {
        params: {
          thoiGianBatDau: params.thoiGianBatDau,
          thoiGianKetThuc: params.thoiGianKetThuc
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportExcelPhuCap(dataForExport: any, thoiGian: any, fileNameExport?: string): Promise<void> {

    if (dataForExport) {
      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/thongTinLamThemGio_PhuCap_20230220.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('PhuCap');

            worksheet.getCell(2, 1).value = `THỜI GIAN: ${thoiGian.thoiGianBatDau} - ${thoiGian.thoiGianKetThuc}`;

            // tổng số dòng ban đầu
            let defaultTotalRow = worksheet.rowCount + 1;

            for (var i = 1; i <= dataForExport.length; i++) {

            }

            dataForExport.forEach((item: any, idx: any) => {
              worksheet.getCell(defaultTotalRow + idx, 1).value = idx + 1;
              worksheet.getCell(defaultTotalRow + idx, 2).value = item['maNhanVien'];
              worksheet.getCell(defaultTotalRow + idx, 3).value = item['hoTenDemVN'];
              worksheet.getCell(defaultTotalRow + idx, 4).value = item['tenVN'];
              worksheet.getCell(defaultTotalRow + idx, 5).value = item['phong'];
              worksheet.getCell(defaultTotalRow + idx, 6).value = item['thu'];
              worksheet.getCell(defaultTotalRow + idx, 7).value = item['thoiGianBatDau'];
              worksheet.getCell(defaultTotalRow + idx, 8).value = item['thoiGianKetThuc'];
              worksheet.getCell(defaultTotalRow + idx, 9).value = item['loaiPhuCap'];
              worksheet.getCell(defaultTotalRow + idx, 10).value = item['soBuoiSang'];
              worksheet.getCell(defaultTotalRow + idx, 11).value = item['soBuoiTrua'];
              worksheet.getCell(defaultTotalRow + idx, 12).value = item['soBuoiChieu'];
              worksheet.getCell(defaultTotalRow + idx, 13).value = item['soQuaDem'];
              worksheet.getCell(defaultTotalRow + idx, 14).value = item['xD_SoBuoiSang'];
              worksheet.getCell(defaultTotalRow + idx, 15).value = item['xD_SoBuoiTrua'];
              worksheet.getCell(defaultTotalRow + idx, 16).value = item['xD_SoBuoiChieu'];
              worksheet.getCell(defaultTotalRow + idx, 17).value = item['xD_SoQuaDem'];
              worksheet.getCell(defaultTotalRow + idx, 18).value = item['moTa'];
              worksheet.getCell(defaultTotalRow + idx, 19).value = item['nxD1_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 20).value = item['nxD2_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 21).value = item['hR_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 22).value = item['hR_GhiChu'];
            })

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                worksheet.getCell(i, j).alignment = ((j >= 3 && j <= 6) || j == 9 || j == 18 || j == 22) ? { vertical: 'middle', horizontal: 'left' } : { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(i, j).font = {
                  name: 'Times New Roman',
                  family: 2,
                  size: 12
                };

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
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  async thongKePhuCap() {
    var params = {
      thoiGianBatDau: "2023-01-01",
      thoiGianKetThuc: '2023-02-01'
    }

    // get data từ api
    var phucaps: any = await this.fn_ThongKePhuCap(params);

    await this.exportExcelPhuCap(phucaps, params)
  }

  // #endregion

  // #region Export excel Làm thêm giờ
  fn_ThongKeLamThemGio(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/TangCa/ThongKeTangCa`;

      this.httpClient.get(apiURL, {
        params: {
          thoiGianBatDau: params.thoiGianBatDau,
          thoiGianKetThuc: params.thoiGianKetThuc
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportExcelLamThemGio(dataForExport: any, thoiGian: any, fileNameExport?: string): Promise<void> {

    if (dataForExport) {
      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/thongTinLamThemGio_PhuCap_20230220.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('LamThemGio');

            worksheet.getCell(2, 1).value = `THỜI GIAN: ${thoiGian.thoiGianBatDau} - ${thoiGian.thoiGianKetThuc}`;

            // tổng số dòng ban đầu
            let defaultTotalRow = worksheet.rowCount + 1;

            for (var i = 1; i <= dataForExport.length; i++) {

            }

            dataForExport.forEach((item: any, idx: any) => {
              worksheet.getCell(defaultTotalRow + idx, 1).value = idx + 1;
              worksheet.getCell(defaultTotalRow + idx, 2).value = item['maNhanVien'];
              worksheet.getCell(defaultTotalRow + idx, 3).value = item['hoTenDemVN'];
              worksheet.getCell(defaultTotalRow + idx, 4).value = item['tenVN'];
              worksheet.getCell(defaultTotalRow + idx, 5).value = item['phong'];
              worksheet.getCell(defaultTotalRow + idx, 6).value = item['ngayTangCa'];
              worksheet.getCell(defaultTotalRow + idx, 7).value = item['thu'];
              worksheet.getCell(defaultTotalRow + idx, 8).value = item['gioVao'];
              worksheet.getCell(defaultTotalRow + idx, 9).value = item['gioRa'];
              worksheet.getCell(defaultTotalRow + idx, 10).value = item['thoiGianBatDau'];
              worksheet.getCell(defaultTotalRow + idx, 11).value = item['thoiGianKetThuc'];

              worksheet.getCell(defaultTotalRow + idx, 12).value = item['moTa'];
              worksheet.getCell(defaultTotalRow + idx, 13).value = item['soGioDangKy'];
              worksheet.getCell(defaultTotalRow + idx, 14).value = item['soGioDuocDuyet'];

              worksheet.getCell(defaultTotalRow + idx, 15).value = item['diTre'];
              worksheet.getCell(defaultTotalRow + idx, 16).value = item['veSom'];

              worksheet.getCell(defaultTotalRow + idx, 17).value = item['nxD1_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 18).value = item['nxD2_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 19).value = item['hR_TrangThai'];
              worksheet.getCell(defaultTotalRow + idx, 20).value = item['hR_GhiChu'];
            })

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                worksheet.getCell(i, j).alignment = ((j >= 3 && j <= 5) || j == 12 || j == 20) ? { vertical: 'middle', horizontal: 'left' } : { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(i, j).font = {
                  name: 'Times New Roman',
                  family: 2,
                  size: 12
                };

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
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  async thongKeLamThemGio() {
    var params = {
      thoiGianBatDau: "2022-01-01",
      thoiGianKetThuc: '2023-03-01'
    }

    // get data từ api
    var lamThemGios: any = await this.fn_ThongKeLamThemGio(params);
    console.log(lamThemGios);

    await this.exportExcelLamThemGio(lamThemGios, params)
  }
  //#endregion

  // #region Export excel Thống kê ngày công

  fn_ThongKeNgayCong(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/TongHopDuLieu/ThongKeNgayCong`;

      this.httpClient.get(apiURL, {
        params: {
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
          phongId: params.phongId,
          banId: params.banId,
          keyword: params.keyword,
          thoiGianBatDau: params.thoiGianBatDau,
          thoiGianKetThuc: params.thoiGianKetThuc
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportExcelThongKeNgayCong(dataForExport: any, thoiGian: any, fileNameExport?: string): Promise<void> {

    if (dataForExport) {
      // đọc file template export
      this.httpClient.get('assets/ExcelTemplates/ThongKeNgayCongTemplate.xlsx', { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            let arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            let worksheet = workbook.getWorksheet('Sheet1');

            worksheet.getCell(2, 1).value = `THỜI GIAN: ${thoiGian.thoiGianBatDau} - ${thoiGian.thoiGianKetThuc}`;

            // tổng số dòng ban đầu
            let defaultTotalRow = worksheet.rowCount + 1;

            dataForExport.forEach((item: any, idx: any) => {
              worksheet.getCell(defaultTotalRow + idx, 1).value = idx + 1;
              worksheet.getCell(defaultTotalRow + idx, 2).value = item['maNhanVien'];
              worksheet.getCell(defaultTotalRow + idx, 3).value = item['hoTenDemVN'];
              worksheet.getCell(defaultTotalRow + idx, 4).value = item['tenVN'];
              worksheet.getCell(defaultTotalRow + idx, 5).value = item['phong'];
              worksheet.getCell(defaultTotalRow + idx, 6).value = item['soGioCongThucTe'];
              worksheet.getCell(defaultTotalRow + idx, 7).value = item['soNgayCongThucTe'];
              worksheet.getCell(defaultTotalRow + idx, 8).value = item['soNgayNghiLe'];
              worksheet.getCell(defaultTotalRow + idx, 9).value = item['soPhutDiTre'];
              worksheet.getCell(defaultTotalRow + idx, 10).value = item['soPhutVeSom'];
              worksheet.getCell(defaultTotalRow + idx, 11).value = item['soPhutViecCaNhan'];
              worksheet.getCell(defaultTotalRow + idx, 12).value = item['soPhutViecCongTy'];
              worksheet.getCell(defaultTotalRow + idx, 13).value = item['soNghiPhepHopLe'];
              worksheet.getCell(defaultTotalRow + idx, 14).value = item['soNghiPhepKhongHopLe'];
            })

            /**
             * Format cell
            */
            for (var i = defaultTotalRow; i <= worksheet.rowCount; i++) {
              // set row height
              worksheet.getRow(i).height = 20;

              for (var j = 1; j <= worksheet.columnCount; j++) {

                // set alginment cell
                worksheet.getCell(i, j).alignment = (j >= 2 && j <= 5) ? { vertical: 'middle', horizontal: 'left' } : { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(i, j).font = {
                  name: 'Times New Roman',
                  family: 2,
                  size: 12
                };

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
             * Ghi file excel
             */
            await workbook.xlsx.writeBuffer().then((data: any) => {
              let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              fs.saveAs(blob, `${fileNameExport ?? 'exportData'}.xlsx`);
            });
          }
        })
    }
  }

  async thongKeNgayCong() {
    var params = {
      pageSize: 1000,
      pageNumber: 1,
      phongId: 0,
      banId: 0,
      keyword: '',
      thoiGianBatDau: '2022-12-01',
      thoiGianKetThuc: '2023-02-28'
    }

    // get data từ api
    var ngaycongs: any = await this.fn_ThongKeNgayCong(params);

    await this.exportExcelThongKeNgayCong(ngaycongs, params)
  }

  // #endregion

  // #region Export excel Chi phí ứng viên 

  fn_GetThuPhiUngVien_GiaiDoan(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/UngVien_GiaiDoan/GetAll`;

      this.httpClient.get(apiURL, {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          keyword: params.keyword,
          chuongTrinhId: params.chuongTrinhId,
          cauHinhPhiId: params.cauHinhPhiId,
          thoiHan: params.thoiHan
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async expThuPhiUngVien_GiaiDoan() {
    var params = {
      pageNumber: 1,
      pageSize: 200,
      keyword: '',
      chuongTrinhId: 0,
      cauHinhPhiId: 0,
      thoiHan: ''
    };

    // get data từ api
    var results: any = await this.fn_GetThuPhiUngVien_GiaiDoan(params);
    results.forEach((item: any) => {
      item.xacNhan_TrangThai = item.xacNhan_TrangThai == 'approved' ? 'Đồng ý' : item.xacNhan_TrangThai == 'approved' ? 'Từ chối' : '';
      item.ngaySinh = item.ngaySinh?.split("T")[0];
    });

    var colForExport = ['maHocVien', 'hoTenDem', 'ten', 'ngaySinh', 'chuongTrinhTen', 'cauHinhPhiTen', 'soTienPhaiThu', 'soTienMienGiam', 'soTienDaThu', 'xacNhan_TrangThai'];

    const temlatePath = 'assets/ExcelTemplates/ThuPhiUngVien_GiaiDoan.xlsx';

    ExportExcel(temlatePath, results, colForExport);
  }
  // #endregion

  // #region Export Danh sách nguồn ứng viên
  fn_GetDsNguonUngVien(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/UngVien/GetDanhSachNguonUngVien`;

      this.httpClient.get(apiURL, {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          keyword: params.keyword,
          strFilter: params.strFilter,
          strSort: params.strSort
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  async exportDsNguonUngVien() {
    var params = {
      pageNumber: 1,
      pageSize: 999,
      keyword: '',
      strFilter: '',
      strSort: ''
    };

    // get data từ api
    var results: any = await this.fn_GetDsNguonUngVien(params);
    results.forEach((item: any) => {
      item.ngaySinh = item.ngaySinh?.split("T")[0];
      item.ngayKhaiGiang = item.ngayKhaiGiang?.split("T")[0];
      item.ngayBatDauHoc = item.ngayBatDauHoc?.split("T")[0];
    });

    var colForExport = ['id', 'hoTenDemVN', 'tenVN', 'ngaySinh', 'doTuoi', 'gioiTinh', 'danhGiaSucKhoe', 'bangCap', 'passport_CCCD', 'crmId', 'chiNhanh', 'tinhTrangPhongVan', 'phanLoai', 'maHocVien', 'dienThoaiDiDong', 'trinhDo', 'hoKhauName', 'hoKhauVungMien', 'tinhTrangPhongVan', 'tonGiaoVN', 'nhomMau', 'chieuCao', 'canNang', 'bmi', 'thiLucPhaiCoKinh', 'thiLucPhaiKhongKinh', 'thiLucTraiCoKinh', 'thiLucTraiKhongKinh', 'thuanTayVN', 'ngayKhaiGiang', 'ngayBatDauHoc', 'ms', 'soThangDaHoc', 'luuY', 'lyDoBaoLuu', 'lyDoNghiHoc', 'congTyPhongVanCuoi', 'soLanPhongVan'];

    const temlatePath = 'assets/ExcelTemplates/DanhSachNguonUngVien.xlsx';

    ExportExcel(temlatePath, results, colForExport);
  }
  //#endregion

  // #region Upload file excel

  ExcelToJSON(file: any) {

    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = function (e: any) {
      var data = e.target.result;

      var workbook = XLSX.read(data, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(function (sheetName) {
        console.log(workbook.Sheets[sheetName]);
      })
    };

    fileReader.onerror = function (ex) {
      console.log(ex);
    };

    fileReader.readAsBinaryString(file);
  };

  excelData: any = []
  // uploadExcel(event: any) {
  //   var input = event.target;
  //   var reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     var data = e.target.result;
  //     var fileData = reader.result;
  //     var wb = XLSX.read(data, { type: 'binary' });

  //     // wb.SheetNames.forEach((sheetName) => {
  //     //   var rowObj: string[] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  //     //   console.log(rowObj);
  //     //   this.excelData = JSON.stringify(rowObj)
  //     // })

  //     var rowObj: string[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  //     console.log(rowObj);
  //     this.excelData = JSON.stringify(rowObj)
  //   };
  //   reader.readAsBinaryString(input.files[0]);
  // }

  uploadExcel1(event: any) {
    var oFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var data = e.target.result;
      var wb = XLSX.read(data, { type: 'binary' });
      var rowObj: string[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
      this.excelData = rowObj.slice(2, rowObj.length);
    };
    reader.readAsBinaryString(oFile);
  }

  uploadExcel2(oEvent: any) {
    var oFile = oEvent.target.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var data = e.target.result;
      var wb = XLSX.read(data, { type: 'binary' });
      // console.log(wb)
      // cfb.SheetNames.forEach((sheetName) => {
      //   var rowObj: string[] = XLSX.utils.sheet_to_json(cfb.Sheets[sheetName]);
      //   console.log(rowObj)
      // });

      var rowObj: string[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      var rowObj: string[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
      var arrObjKey = Object.keys(rowObj[0])
      console.log('key', arrObjKey);

      console.log(rowObj);
      this.excelData = rowObj.slice(2, rowObj.length);
      console.log('Danh sach da xoa header', this.excelData);
    };

    reader.readAsBinaryString(oFile);
  }

  // #endregion

  // #region Export excel
  async ExportExcel(dataForExport: any, colForExport: any, temlateFileName: any, sheetName?: any, fileNameExport?: any): Promise<void> {

    try {
      if (!dataForExport || !colForExport || !temlateFileName) {
        throw new Error('Missing required parameter');
      }

      // đọc file template export
      const temlatePath = `assets/ExcelTemplates/${temlateFileName}.xlsx`;

      this.httpClient.get(temlatePath, { responseType: 'blob' })
        .subscribe((file: Blob) => {

          // xử lý file template sang obj Workbook 
          const workbook = new Workbook();
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            const arrayBuffer = fileReader.result as ArrayBuffer;

            if (arrayBuffer)
              await workbook.xlsx.load(arrayBuffer);

            // lấy ra sheet cần xử lý
            const worksheet = workbook.getWorksheet(`${sheetName ?? 'Sheet1'}`);

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
        });
    } catch (error: any) {
      throw new Error(error);
    }
  }
  //#endregion

}
