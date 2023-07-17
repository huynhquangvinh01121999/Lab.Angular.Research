import { Component } from '@angular/core';

// translate
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  isCollapsed = false

  // translate
  selectedItem: string = 'en'

  // translate
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'fr'])
    translate.setDefaultLang(this.selectedItem)
  }

  /**
   * Chuyển đổi ngôn ngữ ứng dụng
   */
  switchLang = (lang: string) => this.translate.use(lang)

  /**
   * Trả về ngôn ngữ đang sử dụng hiện tại của trình duyệt 
   */
  getCurBrowserLang = () => console.log(this.translate.getBrowserLang())

  /**
   * Trả về loại http đang sử dụng, tiền tố và hậu tố của nơi chứa file ngôn ngữ mà hệ thống sẽ load ra để đọc 
   */
  getCurrentLoader = () => console.log(this.translate.currentLoader.getTranslation)

  /**
   * Trả về ngôn ngữ mặc định ban đầu của ứng dụng khi thiết lập TranslateService
   */
  getDefaultLang = () => {
    console.log(this.translate.defaultLang)
    console.log(this.translate.getDefaultLang())
  }

  /**
   * Trả về tên mã ngôn ngữ từ trình duyệt, ví dụ: "vi-VN"
   */
  getBrowserCultureLang = () => console.log(this.translate.getBrowserCultureLang())
}