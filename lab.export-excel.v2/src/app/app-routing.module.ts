import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachThuPhiComponent } from './pages/danhSachThuPhi/danhSachThuPhi.component';
import { OrtherPageComponent } from './pages/ortherPage/ortherPage.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: 'danhSachThuPhi', pathMatch: 'full', component: DanhSachThuPhiComponent },
  { path: 'orther', pathMatch: 'full', component: OrtherPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
