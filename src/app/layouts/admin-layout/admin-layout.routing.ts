import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UserManagementComponent } from "../../user-management/user-management.component";
import { SubAdminManagementComponent } from "../../sub-admin-management/sub-admin-management.component";
import { AnalyticsComponent } from "../../analytics/analytics.component";
import { LoyaltyPointsComponent } from "../../loyalty-points/loyalty-points.component";
import { CustomerSupportComponent } from "../../customer-support/customer-support.component";
import { CmsComponent } from "../../cms/cms.component";
import { AddCmsComponent } from "../../cms/add-cms/add-cms.component";
import { EditCmsComponent } from "../../cms/edit-cms/edit-cms.component";
import { ViewPointsComponent } from "../../loyalty-points/view-points/view-points.component";
import { EditPointsComponent } from "../../loyalty-points/edit-points/edit-points.component";
import { ReviewRatingComponent } from "../../review-rating/review-rating.component";
import { ReveueManagementComponent } from "../../reveue-management/reveue-management.component";
import { NotificationSettingsComponent } from "../../notifications/notification-settings/notification-settings.component";
import { NotificationListComponent } from "../../notifications/notification-list/notification-list.component";
import { AddSubAdminComponent } from "../../sub-admin-management/add-sub-admin/add-sub-admin.component";
import { PushNotificationComponent } from "../../push-notification/push-notification.component";
import { MerchantHomeComponent } from "app/merchant-home/merchant-home.component";
import { MerchantOnboardingComponent } from "app/merchant-home/merchant-onboarding/merchant-onboarding.component";
import { BusinessOnboardingComponent } from "app/merchant-home/business-onboarding/business-onboarding.component";
import { BusinessCategoryComponent } from "app/merchant-home/business-category/business-category.component";
import { MerchantDocumentComponent } from "app/merchant-home/merchant-document/merchant-document.component";
import { GenerateReportsComponent } from "app/loyalty-points/generate-reports/generate-reports.component";
import { SettlementComponent } from "app/settlement/settlement.component";
import { MerchantDetailsComponent } from "app/settlement/merchant-details/merchant-details.component";
import { NotFoundComponentComponent } from "app/not-found.component/not-found.component.component";
import { AuthGuard } from "../../helpers/auth.guard";
import { UnauthorizedComponent } from "app/unauthorized/unauthorized.component";
import { DeletedUsersComponent } from "app/user-management/deleted-users/deleted-users.component";
import { TransactionDetailsComponent } from "app/transaction-details/transaction-details.component";
import { TransactionInnerDetailsComponent } from "app/transaction-details/transaction-inner-details/transaction-inner-details.component";
import { SpecialDayComponent } from "app/special-day/special-day.component";
import { SettingsComponent } from "app/settings/settings.component";
import { HostComponent } from "app/host/host.component";
import { HostDetailsComponent } from "app/host/host-details/host-details.component";
import { CustomersComponent } from "app/customers/customers.component";
import { CustomersDetailsComponent } from "app/customers/customers-details/customers-details.component";
import { WalletComponent } from "app/wallet/wallet.component";
import { BookingsComponent } from "app/bookings/bookings.component";
import { CustomerSupportCarRentalComponent } from "app/customer-support-car-rental/customer-support-car-rental.component";
import { RefferalComponent } from "app/refferal/refferal.component";
import { CouponsComponent } from "app/coupons/coupons.component";
import { AnalyticReportComponent } from "app/analytic-report/analytic-report.component";
import { VehicleComponent } from "app/vehicle/vehicle.component";
import { VehicleDetailsComponent } from "app/merchant-home/merchant-onboarding/vehicle-details/vehicle-details.component";
export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], },
  { path: "user-management", component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: "deleted-users", component: DeletedUsersComponent, canActivate: [AuthGuard] },
  { path: "subadmin-management", component: SubAdminManagementComponent, canActivate: [AuthGuard] },
  { path: "analytics", component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: "loyalty-points", component: LoyaltyPointsComponent, canActivate: [AuthGuard] },
  { path: "customer-support", component: CustomerSupportCarRentalComponent, canActivate: [AuthGuard] },
  { path: "customer-support2", component: CustomerSupportComponent, canActivate: [AuthGuard] },
  { path: "cms", component: CmsComponent, canActivate: [AuthGuard] },
  { path: "cms/add-cms", component: AddCmsComponent, canActivate: [AuthGuard] },
  { path: "cms/edit-cms/:id", component: AddCmsComponent },
  { path: "loyalty-points/view-points/:id", component: ViewPointsComponent, canActivate: [AuthGuard] },
  { path: "loyalty-points/edit-points", component: EditPointsComponent, canActivate: [AuthGuard] },
  { path: "review-and-ratings", component: ReviewRatingComponent, canActivate: [AuthGuard] },
  { path: "notificaitons", component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: "revenue-management", component: ReveueManagementComponent, canActivate: [AuthGuard] },
  { path: "notificaitons/notifications-setting", component: NotificationSettingsComponent, canActivate: [AuthGuard] },
  // { path: "dashboard/user-profile/:id", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "user-management/user-profile/:id", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "notificaitons/notificaitons-list", component: NotificationListComponent, canActivate: [AuthGuard] },
  {
    path: "subadmin-management/edit-subadmin/:id",
    component: AddSubAdminComponent, canActivate: [AuthGuard]
  },
  {
    path: "push-notification",
    component: PushNotificationComponent, canActivate: [AuthGuard]
  },
  {
    path: 'merchant-home', component: MerchantHomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'coupons', component: CouponsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'new-vehicle-list', component: MerchantOnboardingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'new-vehicle-list/vehicle-details', component: VehicleDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-settings', component: VehicleComponent, canActivate: [AuthGuard]
  },
  {
    path: 'host', component: HostComponent, canActivate: [AuthGuard]
  },
  {
    path: 'host/host-details', component: HostDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'customers', component: CustomersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'booking', component: BookingsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'reffral', component: RefferalComponent, canActivate: [AuthGuard]
  },
  {
    path: 'wallet', component: WalletComponent, canActivate: [AuthGuard]
  },
  {
    path: 'customers/customers-details', component: CustomersDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'merchant-onboarding/:id', component: MerchantOnboardingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'business-onboarding', component: BusinessOnboardingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'business-onboarding/:id', component: BusinessOnboardingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'business-category', component: BusinessCategoryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'merchant-document', component: MerchantDocumentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'analytics-report', component: AnalyticReportComponent, canActivate: [AuthGuard]
  },
  {
    path: 'loyalty-points/reports', component: GenerateReportsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'settlement', component: SettlementComponent, canActivate: [AuthGuard]
  },
  {
    path: 'transactions', component: TransactionDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'transactions/transaction-detail/:id', component: TransactionInnerDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'settlement/merchant_details/:id', component: MerchantDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'special-day', component: SpecialDayComponent, canActivate: [AuthGuard]
  },
  {
    path: 'settings', component: SettingsComponent
  },
  {
    path: 'unauthorized', component: UnauthorizedComponent, canActivate: [AuthGuard]
  }
];
