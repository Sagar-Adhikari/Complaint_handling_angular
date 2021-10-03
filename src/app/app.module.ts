import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InterceptorService } from './services/interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import {
  MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDialogModule, MatRadioModule,
  MatDatepickerModule, MatSelectModule, MatSidenavModule, MatProgressBarModule, MatMenuModule, MatToolbarModule, MatButtonModule,
  MatSliderModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatListModule, MatProgressSpinnerModule, MatSlideToggleModule
} from '@angular/material';


import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

import { LoginComponent } from './components/account/login/login.component';
import { ChangePasswordComponent } from './components/account/change-password/change-password.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ForgetPasswordComponent } from './components/account/forget-password/forget-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordResetComponent } from './components/account/password-reset/password-reset.component';
import { AddComplainComponent } from './components/complain/add-complain/add-complain.component';
import { ComplainListComponent } from './components/complain/complain-list/complain-list.component';
import { ComplainDetailsComponent } from './components/complain/complain-details/complain-details.component';
import { ComplainDialogComponent } from './components/complain/complain-dialog/complain-dialog.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { ServiceProviderDialogComponent } from './components/user/service-provider-dialog/service-provider-dialog.component';
import { MyComplainComponent } from './components/complain/my-complain/my-complain.component';
import { UserListContainerComponent } from './components/user/user-list-container/user-list-container.component';
import { ComplainListContainerComponent } from './components/complain/complain-list-container/complain-list-container.component';
import { SlidePanelComponent } from './tools/slide-panel/slide-panel.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { CategoryDetailsComponent } from './components/category/category-details/category-details.component';
import { ServiceProviderListComponent } from './components/serviceProvider/service-provider-list/service-provider-list.component';
import { AddServiceProviderComponent } from './components/serviceProvider/add-service-provider/add-service-provider.component';
import { ServiceProviderDetailsComponent } from './components/serviceProvider/service-provider-details/service-provider-details.component';
import { ChartsModule } from 'ng2-charts';
// import { ChartTestComponent } from './components/complain/report/chart-test/chart-test.component';
import { MonthlyReportComponent } from './components/complain/report/monthly-report/monthly-report.component';
import { SummaryReportComponent } from './components/complain/report/summary-report/summary-report.component';
import { ComplainReportComponent } from './components/complain/report/complain-report/complain-report.component';
// import { ChartTestComponent } from './components/report/chart-test/chart-test.component';
// import { MonthlyReportComponent } from './components/report/monthly-report/monthly-report.component';
// import { SummaryReportComponent } from './components/report/summary-report/summary-report.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    DashboardComponent,
    PasswordResetComponent,
    AddComplainComponent,
    ComplainListComponent,
    ComplainDetailsComponent,
    ComplainDialogComponent,
    UserListComponent,
    UserDetailsComponent,
    ServiceProviderDialogComponent,
    MyComplainComponent,
    UserListContainerComponent,
    ComplainListContainerComponent,
    SlidePanelComponent,
    CategoryListComponent,
    AddCategoryComponent,
    CategoryDetailsComponent,
    ServiceProviderListComponent,
    AddServiceProviderComponent,
    ServiceProviderDetailsComponent,
    MonthlyReportComponent,
    SummaryReportComponent,
    ComplainReportComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDialogModule, MatRadioModule,
    MatDatepickerModule, MatSelectModule, MatSidenavModule, MatProgressBarModule, MatMenuModule, MatToolbarModule, MatButtonModule,
    MatSliderModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatListModule, MatProgressSpinnerModule,
    ReactiveFormsModule,MatSlideToggleModule,
    FormsModule,
    ChartsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      // backdropBackgroundColour: 'rgba(255, 255, 255, 0.81)',
      backdropBackgroundColour: 'transparent',
      backdropBorderRadius: '0px',
      primaryColour: 'Navy',
      secondaryColour: 'Navy',
      tertiaryColour: 'Navy',
      fullScreenBackdrop: false
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Ld0Y1cUAAAAAArUBr_u1zgRMdqU3P95AqTeEaak'
      } as RecaptchaSettings
    }

  ],
  bootstrap: [AppComponent],
  entryComponents: [ComplainDialogComponent, ServiceProviderDialogComponent]
})
export class AppModule { }
