import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { ACLGuard, ACLType } from '@delon/acl';
import { environment } from '@env/environment';
// layout
import { LayoutBasicComponent } from '../layout/basic/basic.component';
import { LayoutBlankComponent } from '../layout/blank/blank.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// single pages
import { CallbackComponent } from './passport/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AppGuard } from '../core/guards/app.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    //canActivate: [SimpleGuard],
    // canActivate: [AppGuard],
    // data: {
    //   role: 'user'
    // },

    // canActivateChild: [ACLGuard],
    // data: { guard: { role: ['admin'], ability: [10, 'USER-EDIT'], mode: 'allOf' } },

    canActivate: [ACLGuard],
    canActivateChild: [ACLGuard],
    // data: { guard: 'member' },
    // data: {
    //   guard: <ACLType>{ role: ['admin'], ability: [10, 'user'], mode: 'allOf' }
    // },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'dashboard' } },
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ]
  },
  // {
  //     path: 'blank',
  //     component: LayoutBlankComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,

    // canActivate: [AuthGuard],
    canActivateChild: [ACLGuard],
    data: { guard: { role: ['admin'], ability: ['write'], mode: 'allOf' } },
    // data: {
    //   guard: <ACLType>{ role: ['admin'], ability: ['write'], mode: 'allOf' }
    // },
    children: [
      { path: 'login', component: UserLoginComponent, canActivate: [ACLGuard], data: { title: 'Login', guard: 'admin' } },
      { path: 'register', component: UserRegisterComponent, data: { title: 'register' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: 'register-result' } },
      { path: 'lock', component: UserLockComponent, data: { title: 'lock' } },
    ]
  },
  { path: 'passport/callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      useHash: environment.useHash,
      scrollPositionRestoration: 'top',
    }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
