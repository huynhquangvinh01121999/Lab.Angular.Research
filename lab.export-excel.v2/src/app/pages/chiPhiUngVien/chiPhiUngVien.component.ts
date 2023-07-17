import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ExportExcel } from 'src/app/commons/exportExcel';

@Component({
  selector: 'app-chiPhiUngVien',
  templateUrl: './chiPhiUngVien.component.html',
  styleUrls: ['./chiPhiUngVien.component.css']
})
export class ChiPhiUngVienComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  fn_GetChiPhiUngVien(params: any) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/UngVien/GetChiPhiUngVien`;

      this.httpClient.get(apiURL, {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          keyword: params.keyword,
          chuongTrinhId: params.chuongTrinhId,
          chiNhanhId: params.chiNhanhId
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

  async expChiPhiUngVien() {
    var params = {
      pageNumber: 1,
      pageSize: 200,
      keyword: '',
      chuongTrinhId: 0,
      chiNhanhId: 0
    };

    // get data từ api
    var cpUngVien: any = await this.fn_GetChiPhiUngVien(params);
    cpUngVien.forEach((item: any) => {
      item.soTienConLai = item.tongSoTienPhaiThu - item.tongSoTienMienGiam - item.tongSoTienDaThu;
      item.ngaySinh = item.ngaySinh?.split("T")[0];
    });

    var colForExport = ['ChiNhanhTen', 'MaHocVien', 'HoTenDem', 'Ten', 'NgaySinh', 'PhanLoai', 'TongSoTienPhaiThu', 'TongSoTienMienGiam', 'TongSoTienDaThu', 'SoTienConLai'];

    const temlatePath = 'assets/ExcelTemplates/ChiPhiUngVien.xlsx';

    ExportExcel(temlatePath, cpUngVien, colForExport);
  }
}
