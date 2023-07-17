import { Component } from '@angular/core';
import * as Excel from "exceljs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LabImportExcel';
  regex = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xlsx|.xls|.xlsm|.xlt)$/i;

  classDragOver: boolean = false;
  dataImport: any = []

  constructor() { }

  ngOnInit() {
  }
  /*
    // hàm xử lý đọc file excel
    readExcel(event) {
      const workbook = new Excel.Workbook(); // khởi tạo đối tượng workbook xử lý file excel
      const target: DataTransfer = <DataTransfer>(event.target); // khai báo đối tượng target cho sự kiện change file
      // kiểm tra file có tồn tại không?
      if (target.files.length !== 1) {
        throw new Error('Không thể upload file');
      }
  
      // convert file sang dạng array buffer
      const arrayBuffer = new Response(target.files[0]).arrayBuffer();
      // load file
      arrayBuffer.then((data) => {
        workbook.xlsx.load(data).then(() => {
            // read data thuộc sheet đầu tiên trong file excel
            const worksheet = workbook.getWorksheet(1);
            // đọc dữ liệu trong sheet theo từng rows
            if (worksheet.rowCount > 0) {
              worksheet.eachRow(row => {
                // gọi hàm để mapping data
                this.fnXuLy(row.values);
              });
            } else {
              alert("File không có dữ liệu");
            }
          });
      });
    }
  
    fnXuLy(arrayItem) {
      this.dataImport.push({
        ten: arrayItem['1'],
        gioiTinh: arrayItem['2'],
        sdt: arrayItem['3'],
        noiSinh: arrayItem['4'],
        ngheNghiep: arrayItem['5'],
      })
    }
  */
  // ========================================================================================================
  // ========================================================================================================

  // hàm xử lý đọc file excel
  async readExcel(event) {
    var arrayItem = [];
    const workbook = new Excel.Workbook(); // Khởi tạo đối tượng workbook xử lý file excel
    const target: DataTransfer = <DataTransfer>(event.target); // Khai báo đối tượng target cho sự kiện change file

    // Kiểm tra file có tồn tại không?
    if (target.files.length !== 1) {
      throw new Error('Không thể upload file');
    }

    // Convert file sang dạng array buffer
    const arrayBuffer = await new Response(target.files[0]).arrayBuffer();
    console.log(arrayBuffer);


    // Load file
    await workbook.xlsx.load(arrayBuffer);

    // Trả về đối tượng sheet đầu tiên trong file excel
    const sheet = workbook.getWorksheet(1);

    // Kiểm tra sheet có data không
    if (sheet.rowCount > 0) {
      sheet.eachRow(row => {
        arrayItem.push(row.values); // push data vào array return
      });
    } else {
      alert("Không có dữ liệu");
    }

    return arrayItem;
  }

  async fnXuLy(event) {
    let arrayItem = await this.readExcel(event);
    arrayItem.forEach((row) => {
      this.dataImport.push({
        ten: row['1'],
        gioiTinh: row['2'],
        sdt: row['3'],
        noiSinh: row['4'],
        ngheNghiep: row['5'],
      })
    })
  }

  // ========================================================================================================
  // ========================================================================================================

  // drag & drop handle
  // sự kiện kéo file vào vùng đc kéo thả
  dragover(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classDragOver = true;
  }

  // sự kiện kéo file ra khỏi vùng đc kéo thả
  dragleave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classDragOver = false;
  }

  // sự kiện thả file vào vùng đc kéo thả
  drop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.dataImport = [];
    this.classDragOver = false;

    const files = evt.dataTransfer.files;
    if (this.regex.test(files[0].name)) {
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
          const arrayBuffer: any = event.target.result;
          const workbook = new Excel.Workbook()
          await workbook.xlsx.load(arrayBuffer);

          const sheet = workbook.getWorksheet(1);

          if (sheet.rowCount > 0) {
            sheet.eachRow(row => {
              this.dataImport.push({
                ten: row.values['1'],
                gioiTinh: row.values['2'],
                sdt: row.values['3'],
                noiSinh: row.values['4'],
                ngheNghiep: row.values['5'],
              })
            });
          } else {
            alert("Không có dữ liệu");
          }
        };

        reader.onerror = (event) => {
          console.error("Đã xảy ra lỗi khi đọc file: ", event.target.error);
        };

        // Bắt đầu đọc nội dung của file
        reader.readAsArrayBuffer(file);
      }
    } else {
      alert("File không đúng định dạng");
    }
  }
}
