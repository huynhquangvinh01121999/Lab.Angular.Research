import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paste-excel',
  templateUrl: './paste-excel.component.html',
  styleUrls: ['./paste-excel.component.css']
})
export class PasteExcelComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onListenPasted(event: ClipboardEvent) {
    // đọc data từ clipboard ra
    let clipboardData: any = event.clipboardData;
    let pastedText = clipboardData.getData('text/plain');


    // cắt row
    let row_data = pastedText.split('\r\n');

    // cắt data từng cột
    this.displayedColumns = row_data[0].split('\t');

    let data: any = [];

    // xóa phần tử rỗng cuối cùng tự phát sinh
    row_data.pop();

    row_data.forEach((row_data: any) => {
      let row: any = {};
      this.displayedColumns.forEach((col, index) => {
        var valCol = row_data.split('\t')[index];

        // xóa kí tự '"' nằm ở vị trí đầu
        // valCol = valCol.charAt(0) == '"' ? valCol.substring(1, valCol.length) : valCol;

        // xóa kí tự '"' nằm ở vị trí cuối
        // valCol = valCol.charAt(valCol.length - 1) == '"' ? valCol.substring(0, valCol.length - 1) : valCol;

        row[index + 1] = valCol.trim().replaceAll('"', '');

      });
      data.push(row);
    });
    this.dataSource = data;
  }

  // code tối ưu hơn và đã đc clean
  onListenPasted_v2(event: ClipboardEvent) {
    const clipboardData: any = event.clipboardData;
    const pastedText = clipboardData.getData('text/plain');

    const row_data = pastedText.split('\r\n');

    this.displayedColumns = row_data[0].split('\t');

    const data = row_data.slice(0, -1).map((row: any) => {
      const rowData: any = {};
      this.displayedColumns.forEach((col, index) => {
        let valCol = row.split('\t')[index];
        rowData[index + 1] = valCol.trim().replaceAll('"', '');
      });
      return rowData;
    });
    this.dataSource = data;
  }

}
