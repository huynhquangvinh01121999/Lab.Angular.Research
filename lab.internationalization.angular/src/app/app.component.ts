import { Component } from '@angular/core'

import { NzI18nService, en_US, ja_JP, NzI18nInterface } from 'ng-zorro-antd/i18n'
import { en_USCustom, ja_JPCustom, en_USCustom_v2, ja_JPCustom_v2, LanguageInterface } from './models/CustomModels'

import data from "./file/data.json"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false
  isChangeLang = false

  constructor(public i18n: NzI18nService) {
    this.switchLanguage()
  }

  switchLanguage() {
    // let a: any = ja_JP

    // this.i18n.setLocale(a);
    // console.log(this.i18n.getLocale())

    // a = { ...ja_JP, "test": "test" }
    // console.log(a);

    // this.i18n.setLocale(a);
    // console.log(this.i18n.getLocale())

    // custom
    // en_US.orthers = {
    //   Test: 1,
    //   Number: 123
    // }
    // this.i18n.setLocale(en_US)
    // console.log(this.i18n.getLocale())

    let a: any = en_US
    a = { ...en_US, "test": data }
    this.i18n.setLocale(a)
    console.log(this.i18n.getLocaleData("./file/data.json"))

  }

  onSwitchLanguage() {
    this.isChangeLang ? this.i18n.setLocale(en_US) : this.i18n.setLocale(ja_JP)
    this.isChangeLang = !this.isChangeLang
  }

  onSwitchLanguage_v2() {
    this.isChangeLang ? this.i18n.setLocale(en_USCustom) : this.i18n.setLocale(ja_JPCustom)
    this.isChangeLang = !this.isChangeLang
    console.log(this.i18n.getLocale());
  }

  onSwitchLanguage_v3() {
    this.isChangeLang ? this.i18n.setLocale(en_USCustom_v2) : this.i18n.setLocale(ja_JPCustom_v2)
    this.isChangeLang = !this.isChangeLang
    console.log(this.i18n.getLocale());
  }

  onSwitchLanguage_v4() {
    let a: any = en_US
    a = { ...en_US, "values": data }

    let b: any = en_US
    b = { ...ja_JP, "values": data }

    this.isChangeLang ? this.i18n.setLocale(a) : this.i18n.setLocale(b)
    this.isChangeLang = !this.isChangeLang
    console.log(this.i18n.getLocale());
  }
}


