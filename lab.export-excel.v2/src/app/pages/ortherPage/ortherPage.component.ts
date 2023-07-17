import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-ortherPage',
  templateUrl: './ortherPage.component.html',
  styleUrls: ['./ortherPage.component.css']
})
export class OrtherPageComponent implements OnInit {

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  ngOnInit() {
  }

  getData(url: string) {
    fetch(
      'http://192.168.25.24:5050/GetListHiepHoi', // the url you are trying to access
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'GET', // GET, POST, PUT, DELETE
        // mode: 'no-cors' // the most important option
      }
    )
      .then((res: any) => console.log(res.data))
      .catch(err => console.log(err));
  }

  fn_MockApi() {
    // let apiURL = `http://115.78.235.71:8002/employees`;
    // let apiURL = `/api/employees`;
    // let apiURL = `/api/GetHiepHoiById/394`;
    // let apiURL = `https://export-excel.netlify.app/api/GetListHiepHoi`;
    let apiURL = `/api/GetListHiepHoi`;

    this.httpClient.get(apiURL)
      .subscribe((data) => {
        console.log(data);
      });

    // this.getData(apiURL);
  }

  formatDateToCustomFormat(date: Date) {
    // var year = date.getFullYear().toString().slice(-2);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');

    return year + month + day + hours + minutes + seconds;
  }

  formatDate(date: Date, type: string) {
    switch (type) {
      case 'yyyyMMdd':
        return date.toLocaleDateString('en-GB').split('/').reverse().join('');
      case 'yyyy-MM-dd':
        return date.toLocaleDateString('en-GB').split('/').reverse().join('-');
      case 'yyyy/MM/dd':
        return date.toLocaleDateString('en-GB').split('/').reverse().join('/');

      case 'ddMMyyyy':
        return date.toLocaleDateString('en-GB').split('/').join('');
      case 'dd-MM-yyyy':
        return date.toLocaleDateString('en-GB').split('/').join('-');
      case 'dd/MM/yyyy':
        return date.toLocaleDateString('en-GB').split('/').join('/');

      case 'HHmmss':
        return date.toLocaleTimeString().split(':').join('');
      case 'HH:mm:ss':
        return date.toLocaleTimeString();

      case 'yyyyMMddHHmmss':
        return date.toLocaleDateString('en-GB').split('/').reverse().join('').concat(date.toLocaleTimeString().split(':').join(''))
      default:
        return date.toLocaleString();
    }
  }

  // format to yyyyMMddHHmmss
  fn_FormatDate() {
    var date = new Date();

    // c1
    //console.log(this.formatDate(date, 'ddMMyyyy'));

    // c2
    //console.log(this.formatDateToCustomFormat(date));

    // c3 Tham khao: https://stackoverflow.com/questions/43630445/how-to-convert-current-date-to-yyyy-mm-dd-format-with-angular-2
    console.log(this.datePipe.transform(date, "yyyy-MM-dd"));
  }

}
