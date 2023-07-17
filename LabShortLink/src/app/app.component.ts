import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fnAccessToken();
  }

  BASE_URL = 'https://api-ssl.bitly.com';
  CLIENT_ID = '13dbb840178ea855f4dc732a2ceba50ff5f70c78';
  CLIENT_SECRET = 'aa13007914d33f09032c7e929977dc1799797486';
  USERNAME = 'huynhquangvinh01121999.work@gmail.com';
  PASSWORD = 'Saigon@2023';
  HOST = 'api-ssl.bitly.com';

  url_access_token = 'oauth/access_token';
  url_group = 'v4/groups';
  url_shortLink = 'v4/shorten';

  fnAccessToken() {
    var url = `${this.BASE_URL}/${this.url_access_token}`;

    const auth = Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString("base64");
    var headers = {
      "Content-type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`,
      "Host": 'api-ssl.bitly.com'
    }

    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
    headers_object.append("Authorization", `Basic ${auth}`);

    const httpOptions = {
      headers: headers_object
    };

    var body = {
      grant_type: 'password',
      username: this.USERNAME,
      password: this.PASSWORD
    };
    this.http.post(url, body, httpOptions).toPromise();
  }

  async GetToken() {
    var result = await this.fnAccessToken();
    console.log(result);
  }
}
