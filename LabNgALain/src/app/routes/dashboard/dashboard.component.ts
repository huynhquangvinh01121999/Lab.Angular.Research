import { Component, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(private http: _HttpClient, private aclSrv: ACLService) {

  }

  ngOnInit(): void {
    // console.log('test');
    // console.log(this.aclSrv.canAbility('NguonUngVien_LA123'));

    // Đặt khả năng cho phép người dùng hiện tại (tất cả sẽ bị xóa trước)
    this.aclSrv.setAbility(['write', 'read']);

    // Gắn vai trò cho người dùng hiện tại
    this.aclSrv.attachRole(['admin']);

    console.log(this.aclSrv.can({
      role: ['user'],
      ability: ['get'],
      mode: 'oneOf'
    }));
  }

}
