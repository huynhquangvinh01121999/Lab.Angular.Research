import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ExportExcel } from 'src/app/commons/exportExcel';

@Component({
  selector: 'app-danhSachThuPhi',
  templateUrl: './danhSachThuPhi.component.html',
  styleUrls: ['./danhSachThuPhi.component.css']
})
export class DanhSachThuPhiComponent implements OnInit {

  private numberFormat = new Intl.NumberFormat()

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  fn_GetDanhSachThuPhi(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/QuanLyThuChi/GetDanhSachThuPhi`;

      this.httpClient.get(apiURL, {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          keyword: params.keyword,
          nguonDuLieu: params.nguonDuLieu,
          tuNgay: params.tuNgay,
          denNgay: params.denNgay
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

  async expDanhSachThuPhi() {
    var params = {
      pageNumber: 1,
      pageSize: 999,
      keyword: '',
      nguonDuLieu: '',
      tuNgay: '',
      denNgay: ''
    };

    // get data từ api
    var result: any = await this.fn_GetDanhSachThuPhi(params);

    // format data
    result[0].danhSachThuPhis.forEach((item: any) => {
      item.ngayNhap = item.ngayNhap?.split("T")[0];
      item.soTien = this.numberFormat.format(item.soTien);
    });

    // list các cell cần mapping data độc lập
    var listCellValue: any = [
      { cell: 'C3', value: this.numberFormat.format(result[0].tongTienMat) },
      { cell: 'E3', value: this.numberFormat.format(result[0].tongTienChuyenKhoan) },
      { cell: 'G3', value: this.numberFormat.format(result[0].tongTien) }
    ]

    var colForExport = ['tenKhachHang', 'thongTinCaNhanMaHocVien', 'dealId', 'invoiceId', 'nguonDuLieu', 'ngayNhap', 'hinhThucThanhToan', 'soTien', 'dienGiai', 'ghiChu'];

    const temlatePath = 'assets/ExcelTemplates/DanhSachThuPhi.xlsx';

    ExportExcel(temlatePath, result[0].danhSachThuPhis, colForExport, listCellValue);
  }
}
