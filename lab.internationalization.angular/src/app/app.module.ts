import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { registerLocaleData } from '@angular/common';
import { NZ_I18N, en_US, fr_FR, ja_JP } from 'ng-zorro-antd/i18n';
import { LOCALE_ID } from '@angular/core';

import en from '@angular/common/locales/en';

registerLocaleData(en)

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [
    // { provide: NZ_I18N, useValue: 'en' },
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en-US':
            console.log('Default: en-US');
            return en_US;
          /** keep the same with angular.json/i18n/locales configuration **/
          case 'fr':
            console.log('Default: fr');
            return fr_FR;
          default:
            console.log('Default');
            return ja_JP;
        }
      },
      deps: [LOCALE_ID]
    }
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule
  ]
})
export class AppModule { }