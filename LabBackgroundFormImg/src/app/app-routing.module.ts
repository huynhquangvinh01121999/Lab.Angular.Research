import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseBasicComponent } from './use-basic/use-basic.component';
import { UseFabricComponent } from './use-fabric/use-fabric.component';

const routes: Routes = [
  { path: 'fabric', component: UseFabricComponent },
  { path: 'basic', component: UseBasicComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
