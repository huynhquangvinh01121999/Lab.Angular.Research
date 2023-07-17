import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasteExcelComponent } from './paste-excel/paste-excel.component';

const routes: Routes = [
  { path: '', component: PasteExcelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
