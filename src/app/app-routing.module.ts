import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { ChangePasswordComponent } from './components/account/change-password/change-password.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ForgetPasswordComponent } from './components/account/forget-password/forget-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordResetComponent } from './components/account/password-reset/password-reset.component';
import { AddComplainComponent } from './components/complain/add-complain/add-complain.component';
import { ComplainDetailsComponent } from './components/complain/complain-details/complain-details.component';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { MyComplainComponent } from './components/complain/my-complain/my-complain.component';
import { UserListContainerComponent } from './components/user/user-list-container/user-list-container.component';
import { ComplainListContainerComponent } from './components/complain/complain-list-container/complain-list-container.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { ServiceProviderListComponent } from './components/serviceProvider/service-provider-list/service-provider-list.component';
import { AddServiceProviderComponent } from './components/serviceProvider/add-service-provider/add-service-provider.component';
import { CategoryDetailsComponent } from './components/category/category-details/category-details.component';
import { ServiceProviderDetailsComponent } from './components/serviceProvider/service-provider-details/service-provider-details.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SummaryReportComponent } from './components/complain/report/summary-report/summary-report.component';
import { MonthlyReportComponent } from './components/complain/report/monthly-report/monthly-report.component';
import { ComplainReportComponent } from './components/complain/report/complain-report/complain-report.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'login/:userId/:token', component: LoginComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuardService] },
  { path: 'forgot-password', component: ForgetPasswordComponent, canActivate: [AuthGuardService] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'reset-password/:userId/:token', component: PasswordResetComponent, pathMatch: "full" },

  { path: 'add-complain', component: AddComplainComponent, canActivate: [AuthGuardService] },
  { path: 'get-complain/:id', component: ComplainDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'get-user/:id', component: UserDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'my-complain', component: MyComplainComponent, canActivate: [AuthGuardService] },
  { path: 'complain-list', component: ComplainListContainerComponent, canActivate: [AuthGuardService] },
  { path: 'view-complain', component: ComplainDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'user-list', component: UserListContainerComponent, canActivate: [AuthGuardService] },

  { path: 'category-list', component: CategoryListComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },
  { path: 'get-category/:id', component: CategoryDetailsComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },
  { path: 'add-category', component: AddCategoryComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },
  { path: 'category/:id', component: AddCategoryComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },

  { path: 'service-provider-list', component: ServiceProviderListComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },
  { path: 'get-service-provider/:id', component: ServiceProviderDetailsComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },
  { path: 'add-service-provider', component: AddServiceProviderComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },//add
  { path: 'service-provider/:id', component: AddServiceProviderComponent, canActivate: [AuthGuardService], data: { roleId: '1,3' } },//edit
  { path: 'summary-report', component: SummaryReportComponent, canActivate: [AuthGuardService] },
  { path: 'complain-report', component: ComplainReportComponent, canActivate: [AuthGuardService] },
  { path: 'monthly-report', component: MonthlyReportComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
