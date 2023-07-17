import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false
  languages = ['jp', 'vi']
  selectedTeam = ''
  currentDate = new Date();
  name = 'vinh'

  constructor(private translate: TranslateService, private notification: NzNotificationService) {
    translate.setDefaultLang('jp')

    var lang = localStorage.getItem('lang')
    if (lang != null) {
      translate.use(lang)
      this.selectedTeam = lang
    } else {
      translate.use('vi')
      this.selectedTeam = 'vi'
    }
  }

  onSwitch() {
    this.translate.use(this.selectedTeam)
  }

  onSelected(value: string): void {
    localStorage.setItem('lang', value)
    this.selectedTeam = value
    this.translate.use(value)

    // this.translate.get('welcome-you', { name: 'Mr.Vinh' }).subscribe((res: string) => {
    //   console.log(res)
    // });
  }

  onSelected2(value: string): void {
    localStorage.setItem('lang', value)
    this.selectedTeam = value
    this.translate.use(value)

    // this.translate.get('welcome-you', { name: 'Mr.Vinh' }).subscribe((res: string) => {
    //   console.log(res)
    // });
  }

  toastNotification(): void {

    var key: string[] = ['checkios.dieuchinhts.thanhcong', 'checkios.dieuchinhts.capnhatthanhcong']
    this.translate.get(key).subscribe(x => console.log(x))

    //var title: string = ''
    // var content: string = ''
    // this.translate.get('checkios.dieuchinhts.thanhcong').subscribe(x => title = x)
    // this.translate.stream('checkios.dieuchinhts.thanhcong').subscribe(x => console.log(x))
    //this.translate.get('checkios.dieuchinhts.capnhatthanhcong').subscribe(x => content = x)

    // this.notification
    //   .success(this.translate.instant('checkios.dieuchinhts.thanhcong')
    //     , this.translate.instant('checkios.dieuchinhts.capnhatthanhcong'))
    //   .onClick.subscribe(() => {
    //     console.log('notification clicked!')
    //   });
  }
}

//https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate
