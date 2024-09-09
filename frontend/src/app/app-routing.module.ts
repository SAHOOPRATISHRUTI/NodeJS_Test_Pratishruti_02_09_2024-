import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import {aurhGuardGuard} from './aurh-guard.guard'

const routes: Routes = [
  {path:'',redirectTo:'/ntspl',pathMatch:'full'},
  {path:'ntspl',component:LoginComponent},
  {path:'otp',component:VerifyOtpComponent},
  {path:'user-dashboard',component:UserDashboardComponent, canActivate: [aurhGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
