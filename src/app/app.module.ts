import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { fakeBackendProvider } from "./helpers";
import { ToastrModule } from "ngx-toastr";

import { BasicAuthInterceptor, ErrorInterceptor } from "./helpers";
import { UserManagementComponent } from "./user-management/user-management.component";
import { SubAdminManagementComponent } from "./sub-admin-management/sub-admin-management.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { LoyaltyPointsComponent } from "./loyalty-points/loyalty-points.component";
import { CustomerSupportComponent } from "./customer-support/customer-support.component";
import { CmsComponent } from "./cms/cms.component";
import { AddCmsComponent } from "./cms/add-cms/add-cms.component";
import { EditCmsComponent } from "./cms/edit-cms/edit-cms.component";
import { ViewPointsComponent } from "./loyalty-points/view-points/view-points.component";
import { EditPointsComponent } from "./loyalty-points/edit-points/edit-points.component";
import { ReviewRatingComponent } from "./review-rating/review-rating.component";
import { ReveueManagementComponent } from "./reveue-management/reveue-management.component";
import { NotificationSettingsComponent } from "./notifications/notification-settings/notification-settings.component";
import { NotificationListComponent } from "./notifications/notification-list/notification-list.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";
import { VerifyOptComponent } from "./login/verify-opt/verify-opt.component";
import { ChangePasswordComponent } from "./login/change-password/change-password.component";
import { AddSubAdminComponent } from "./sub-admin-management/add-sub-admin/add-sub-admin.component";
import { PushNotificationComponent } from "./push-notification/push-notification.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgApexchartsModule } from "ng-apexcharts";
import { MerchantHomeComponent } from './merchant-home/merchant-home.component';
import { MerchantOnboardingComponent } from './merchant-home/merchant-onboarding/merchant-onboarding.component';
import { BusinessOnboardingComponent } from './merchant-home/business-onboarding/business-onboarding.component';
import { BusinessCategoryComponent } from './merchant-home/business-category/business-category.component';
import { MerchantDocumentComponent } from './merchant-home/merchant-document/merchant-document.component';
import { GenerateReportsComponent } from './loyalty-points/generate-reports/generate-reports.component';
import { SettlementComponent } from './settlement/settlement.component';
import { MerchantDetailsComponent } from './settlement/merchant-details/merchant-details.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxEditorModule } from 'ngx-editor';
import { SearchingDirective } from './services/searching.directive';
import { AppAlphanumericInputDirective } from './services/app-alphanumeric-input.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NotFoundComponentComponent } from './not-found.component/not-found.component.component';
import { RelativeTimePipePipe } from './services/relative-time.pipe.pipe';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { DeletedUsersComponent } from './user-management/deleted-users/deleted-users.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionInnerDetailsComponent } from './transaction-details/transaction-inner-details/transaction-inner-details.component';
import { SpecialDayComponent } from './special-day/special-day.component';
import { SettingsComponent } from './settings/settings.component';
import { NgxOtpInputModule } from "ngx-otp-input";
import { HostComponent } from './host/host.component';
import { HostDetailsComponent } from './host/host-details/host-details.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomersDetailsComponent } from './customers/customers-details/customers-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { BookingsComponent } from './bookings/bookings.component';
import { CustomerSupportCarRentalComponent } from './customer-support-car-rental/customer-support-car-rental.component';
import { RefferalComponent } from './refferal/refferal.component';
import { CouponsComponent } from './coupons/coupons.component';
import { AnalyticReportComponent } from './analytic-report/analytic-report.component';
import { VehicleComponent } from "./vehicle/vehicle.component";
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { VehicleDetailsComponent } from './merchant-home/merchant-onboarding/vehicle-details/vehicle-details.component';
// import { DateTimeAgoPipePipe } from './dashboard/date-time-ago-pipe.pipe';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgxOtpInputModule,
    // ToastrModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000, // 5 seconds
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added
    NgApexchartsModule,
    NgbModule,
    NgxPaginationModule,
    NgxIntlTelInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxEditorModule,
    PdfViewerModule,
    TypeaheadModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    UserManagementComponent,
    SubAdminManagementComponent,
    AnalyticsComponent,
    LoyaltyPointsComponent,
    CustomerSupportComponent,
    CmsComponent,
    AddCmsComponent,
    EditCmsComponent,
    ViewPointsComponent,
    EditPointsComponent,
    ReviewRatingComponent,
    ReveueManagementComponent,
    NotificationSettingsComponent,
    NotificationListComponent,
    ResetPasswordComponent,
    VerifyOptComponent,
    ChangePasswordComponent,
    AddSubAdminComponent,
    PushNotificationComponent,
    MerchantHomeComponent,
    MerchantOnboardingComponent,
    BusinessOnboardingComponent,
    BusinessCategoryComponent,
    MerchantDocumentComponent,
    GenerateReportsComponent,
    SettlementComponent,
    MerchantDetailsComponent,
    SearchingDirective,
    AppAlphanumericInputDirective,
    NotFoundComponentComponent,
    RelativeTimePipePipe,
    UnauthorizedComponent,
    DeletedUsersComponent,
    TransactionDetailsComponent,
    TransactionInnerDetailsComponent,
    SpecialDayComponent,
    SettingsComponent,
    HostComponent,
    HostDetailsComponent,
    CustomersComponent,
    CustomersDetailsComponent,
    WalletComponent,
    BookingsComponent,
    CustomerSupportCarRentalComponent,
    RefferalComponent,
    CouponsComponent,
    AnalyticReportComponent,
    VehicleComponent,
    VehicleDetailsComponent,
    // DateTimeAgoPipePipe,
  ],
  providers: [
    /*  { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }, */
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
