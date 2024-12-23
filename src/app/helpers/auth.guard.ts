import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "../services";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    
    if (currentUser) {
      const path = route.routeConfig.path.split('/')[0].replace(/-/g, '_');
      const permissions = currentUser['status'] 
        ? currentUser['data']['existingUser']['adminPermission'] 
        : currentUser['existingUser']['adminPermission']
      
      if (this.hasPermission(path, permissions)) {
        return true;
      }

      // this.router.navigate(['/unauthorized']);
      // return false;
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private hasPermission(path: string, permissions: string[]): boolean {
    const subadminPermissions = ['subadmin_management', 'sub_admin_management'];
    const subadminPermissions2 = ['notificaiton', 'notificaitons'];

    if (path === 'subadmin_management') {
      return subadminPermissions.some(permission => permissions.includes(permission));
    }
    if (path === 'notificaitons') {
      return subadminPermissions2.some(permission => permissions.includes(permission));
    }

    return path && path !== 'unauthorized' ? permissions.includes(path) : true;
  }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const currentUser = this.authenticationService.currentUserValue;
  //   if (currentUser) {
  //     var newPath = route.routeConfig.path.split('/');
     
  //     var currentPath = newPath[0].replace(/-/g, "_");
  //     if (currentPath === "subadmin_management") {
  //       var isPresent = false;
  //       if (currentUser['status']) {
  //         if ( currentUser['data']['existingUser']['adminPermission'].includes("subadmin_management") ||
  //         currentUser['data']['existingUser']['adminPermission'].includes("sub_admin_management")
  //         ) {
  //           isPresent = true
  //         }
  //       }
  //       else {
  //         if (currentUser['existingUser']['adminPermission'].includes("subadmin_management") ||
  //           currentUser['existingUser']['adminPermission'].includes("sub_admin_management")
  //         ) {
  //           isPresent = true
  //         }
  //       }
  //       if (!isPresent) {
  //         this.router.navigate(["/unauthorized"]);
  //       }
  //     }
  //     else if (currentPath !== "subadmin_management") {

  //       if (currentPath != "" && currentPath != "unauthorized") {
  //         var isPresent = false;
  //         if (currentUser['status']) {
  //           isPresent = currentUser['data']['existingUser']['adminPermission'].includes(currentPath);
  //         }
  //         else {
  //           isPresent = currentUser['existingUser']['adminPermission'].includes(currentPath);
  //         }
  //         if (!isPresent) {
  //           this.router.navigate(["/unauthorized"]);
  //         }

  //       }
  //     }
  //     return true;
  //   }

  //   this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
  //   return false;
  // }
}
/* import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  icon2: string;
  class: string;
  slug: string;
}
const ROUTES_1: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "../../../assets/img/side-menu-icons/dashboard.png",
    icon2: "../../../assets/img/side-menu-icons/dashboard_active.png",
    class: "",
    slug: "dashboard"
  },
  {
    path: "/user-management",
    title: "User Management",
    icon: " ../../../assets/img/side-menu-icons/user_management.png",
    icon2: "../../../assets/img/side-menu-icons/user_management_active.png",
    class: "",
    slug: "user_management"
  },
  {
    path: "/settlement",
    title: "Settlement",
    icon: " ../../../assets/img/side-menu-icons/user_management.png",
    icon2: "../../../assets/img/side-menu-icons/user_management_active.png",
    class: "",
    slug: "settlement"
  },
  {
    path: "/revenue-management",
    title: "Revenue Management",
    icon: "../../../assets/img/side-menu-icons/revenue_management.png",
    icon2: "../../../assets/img/side-menu-icons/revenue_management_active.png",
    class: "",
    slug: "revenue_management"
  },
  {
    path: "/sub-admin-management",
    title: "Sub Admin Management",
    icon: "../../../assets/img/side-menu-icons/sub_admin_management.png",
    icon2: "../../../assets/img/side-menu-icons/sub_admin_management_active.png",
    class: "",
    slug: "subadmin_management"
  },
  {
    path: "/customer-support",
    title: "Customer Support",
    icon: "../../../assets/img/side-menu-icons/customer_support.png",
    icon2: "../../../assets/img/side-menu-icons/customer_support_active.png",
    class: "",
    slug: "customer_support"
  },
  {
    path: "/cms",
    title: "Content Management System",
    icon: "../../../assets/img/side-menu-icons/contant_management_system.png",
    icon2: "../../../assets/img/side-menu-icons/contant_management_system_active.png",
    class: "",
    slug: "cms"
  },
  {
    path: "/loyalty-points",
    title: "Loyalty Points",
    icon: "../../../assets/img/side-menu-icons/loyalty_points.png",
    icon2: "../../../assets/img/side-menu-icons/loyalty_points_active.png",
    class: "",
    slug: "loyalty_points"
  },
  {
    path: "/analytics",
    title: "Analytics",
    icon: "../../../assets/img/side-menu-icons/setting.png",
    icon2: "../../../assets/img/side-menu-icons/setting_active.png",
    class: "",
    slug: "analytics"
  },
  {
    path: "/review-rating",
    title: "Reviews & Ratings",
    icon: "../../../assets/img/side-menu-icons/setting.png",
    icon2: "../../../assets/img/side-menu-icons/setting_active.png",
    class: "",
    slug: "review_and_ratings"
  },
  {
    path: "/notifications",
    title: "Notifications",
    icon: "../../../assets/img/side-menu-icons/notification.png",
    icon2: "../../../assets/img/side-menu-icons/notification_active.png",
    class: "",
    slug: "notificaitons"
  },
  {
    path: "/push-notification",
    title: "Push Notifications",
    icon: "../../../assets/img/side-menu-icons/push_notification.png",
    icon2: "../../../assets/img/side-menu-icons/push_notification_active.png",
    class: "",
    slug: "push_notification"
  },

  {
    path: "/merchant-home",
    title: "Home",
    icon: "",
    icon2: "../../../assets/img/side-menu-icons/dashboard.png",
    class: "",
    slug: "merchant_home"
  },
  {
    path: "/merchant-onboarding",
    title: "Merchant Onboarding",
    icon: "",
    icon2: "../../../assets/img/side-menu-icons/dashboard.png",
    class: "",
    slug: "merchant_onboarding"
  },
  {
    path: "/business-onboarding",
    title: "Business Onboarding",
    icon: "",
    icon2: "../../../assets/img/side-menu-icons/dashboard.png",
    class: "",
    slug: "business_onboarding",

  },
  {
    path: "business-category",
    title: "Business Category",
    icon: "",
    icon2: "../../../assets/img/side-menu-icons/dashboard.png",
    class: "",
    slug: "business_category",

  },
  {
    path: "/logout",
    title: "Logout",
    icon: "../../../assets/img/side-menu-icons/logout.png",
    icon2: "../../../assets/img/side-menu-icons/logout_active.png",
    class: "logOutUser",
    slug: "logout"
  },
];

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private allowedRoutes: string[] = [
    '/logout',
    '/login',
    '/reset-password',
    '/verify-otp',
    '/change-password',
    '/page-not-found'
  ];
  permissionMenu: any[] = []
  userData: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.userData = localStorage.getItem("currentUser");
    this.userData = JSON.parse(this.userData);
    this.permissionMenu = this.userData?.existingUser?.adminPermission;
    if (this.permissionMenu && this.permissionMenu.length > 0) {
      ROUTES_1.forEach(route => {
        if (this.permissionMenu.includes(route.slug)) {
          this.allowedRoutes.push(route.path);
        }
      });
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authenticationService.currentUserValue;
    const url: string = state.url;

    // Check if user is authenticated
    if (currentUser) {
    
    // Check if the user has permission to access the route
      // if (this.allowedRoutes.includes(url)) {
        if (this.allowedRoutes.some(allowedRoute => url.startsWith(allowedRoute)))
          {
        return true;
        
      }else {
        if(url === " ")
          {
            this.router.navigate(['/login']);
            return true;
            
          }else
          {
            this.router.navigate(['/page-not-found']);  // Redirect to a 404 page
            return false;
          }
       
      }
    } else {
      // Not logged in so redirect to login page with the return URL
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
} */

