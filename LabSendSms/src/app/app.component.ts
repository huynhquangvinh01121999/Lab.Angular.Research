import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // noi dung can gui
  TO_PHONE_NUMBER: string = '0909997894';
  MESSAGES: string = 'Test send sms';

  // config
  CLIENT_ID = 'f5b9d888D2C812D64fd309535f3a27336576C56c'
  CLIENT_SECRET = '614bae50023bbc06FB93885b02066a4e4703AA099a935f25077590d650e9a8730fA2c771'
  SCOPE = 'send_brandname_otp send_brandname_otp'
  SESSION_ID = '5c22be0c0396440829c98d7ba124092020145753419'
  GRANT_TYPE = 'client_credentials'
  BRAND_NAME = 'ESUHAI'
  REQUEST_ID = 'tranID-Core01-987654321'

  base_url = 'https://esuhai.vn/api'
  access_token: any

  constructor(private httpClient: HttpClient) { }

  fnGetToken(): Observable<any> {
    let url = `${this.base_url}/token`;
    var model = {
      "client_id": this.CLIENT_ID,
      "client_secret": this.CLIENT_SECRET,
      "scope": this.SCOPE,
      "session_id": this.SESSION_ID,
      "grant_type": this.GRANT_TYPE
    }
    return this.httpClient.post(url, model);
  }

  fnSendSms(model: any): Observable<any> {
    let url = `${this.base_url}/send-sms`;
    return this.httpClient.post(url, model);
  }

  SendMessage(phone: any, message: any) {
    if (phone != null && phone != undefined && phone != '') {
      this.fnGetToken().subscribe(
        (resp: any) => {
          this.access_token = resp.access_token
        }
      );

      var model = {
        "access_token": this.access_token,
        "session_id": this.SESSION_ID,
        "BrandName": this.BRAND_NAME,
        "Phone": phone,
        "Message": Buffer.from(message, 'base64'),
        "RequestId": this.REQUEST_ID
      }

      this.fnSendSms(model).subscribe(
        (resp: any) => {
          console.log(resp);
        }
      );
    }
  }
}
