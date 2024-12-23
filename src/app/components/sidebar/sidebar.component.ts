import { Component, OnInit, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
declare const $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  icon2: string;
  class: string;
  subMenus?: RouteInfo[];
  slug: string;
}
export const ROUTES: RouteInfo[] = []
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
    path: "/wallet",
    title: "wallet",
    icon: "../../../assets/img/side-menu-icons/dashboard.png",
    icon2: "../../../assets/img/side-menu-icons/dashboard_active.png",
    class: "",
    slug: "dashboard"
  },
  {
    path: "/host",
    title: "Host",
    icon: " ../../../assets/img/side-menu-icons/settlement-grey.png",
    icon2: "../../../assets/img/side-menu-icons/settlement-purple.png",
    class: "",
    slug: "settlement"
  },
  {
    path: "/subadmin-management",
    title: "Sub Admin Management",
    icon: "../../../assets/img/side-menu-icons/sub_admin_management.png",
    icon2: "../../../assets/img/side-menu-icons/sub_admin_management_active.png",
    class: "",
    slug: "subadmin_management"
  },
  {
    path: "/customers",
    title: "Customers",
    icon: "../../../assets/img/side-menu-icons/sub_admin_management.png",
    icon2: "../../../assets/img/side-menu-icons/sub_admin_management_active.png",
    class: "",
    slug: "user_management"
  },
  {
    path: "/settings",
    title: "Settings",
    icon: "../../../assets/img/side-menu-icons/special_day_grey.png",
    icon2: "../../../assets/img/side-menu-icons/special_day_purple.png",
    class: "",
    slug: "special_day"
  },
  {
    path: "",
    title: "Vehicle",
    icon: " ../../../assets/img/side-menu-icons/user_management.png",
    icon2: "../../../assets/img/side-menu-icons/user_management_active.png",
    class: "",
    slug: "user_management_delete",
    subMenus: [
      {
        path: "/new-vehicle-list",
        title: "New Vehicle",
        icon: "",
        icon2: "",
        class: "",
        slug: "user_management"
      },
      {
        path: "/vehicle-settings",
        title: "Vehicle Settings",
        icon: "",
        icon2: "",
        class: "",
 
        slug: "deleted_users"
      },
    ]
  },
  {
    path: "/booking",
    title: "Booking",
    icon: "../../../assets/img/side-menu-icons/special_day_grey.png",
    icon2: "../../../assets/img/side-menu-icons/special_day_purple.png",
    class: "",
    slug: "special_day"
  },
  {
    path: "/coupons",
    title: "Coupons",
    icon: "../../../assets/img/side-menu-icons/special_day_grey.png",
    icon2: "../../../assets/img/side-menu-icons/special_day_purple.png",
    class: "",
    slug: "special_day"
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
    path: "/analytics-report",
    title: "Analytics",
    icon: "../../../assets/img/side-menu-icons/Analytics-grey.png",
    icon2: "../../../assets/img/side-menu-icons/Analytics-purple.png",
    class: "",
    slug: "analytics"
  },
  {
    path: "/review-and-ratings",
    title: "Reviews & Ratings",
    icon: "../../../assets/img/side-menu-icons/review_grey.png",
    icon2: "../../../assets/img/side-menu-icons/review-purple.png",
    class: "",
    slug: "review_and_ratings"
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
    path: "/customer-support",
    title: "Customer Support",
    icon: "../../../assets/img/side-menu-icons/customer_support.png",
    icon2: "../../../assets/img/side-menu-icons/customer_support_active.png",
    class: "",
    slug: "customer_support"
  },
  {
    path: "/cms",
    title: "CMS",
    icon: "../../../assets/img/side-menu-icons/contant_management_system.png",
    icon2: "../../../assets/img/side-menu-icons/contant_management_system_active.png",
    class: "",
    slug: "cms"
  },
  {
    path: "/deleted-users",
    title: "Tracking",
    icon: "../../../assets/img/side-menu-icons/contant_management_system.png",
    icon2: "../../../assets/img/side-menu-icons/contant_management_system_active.png",
    class: "",
    slug: "cms"
  },
  {
    path: "/reffral",
    title: "Referral",
    icon: "../../../assets/img/side-menu-icons/contant_management_system.png",
    icon2: "../../../assets/img/side-menu-icons/contant_management_system_active.png",
    class: "",
    slug: "cms"
  },
  {
    path: "/settlement",
    title: "Settlement",
    icon: " ../../../assets/img/side-menu-icons/settlement-grey.png",
    icon2: "../../../assets/img/side-menu-icons/settlement-purple.png",
    class: "",
    slug: "settlement"
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
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Manual ID'",
    "'Name'",
    "'Phone No'",
    "'Email'"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross: boolean = false;
  searchInput: Subject<string> = new Subject<string>();
  seachValue: string = "";
  againSearchedValue: string = ''
  getSeachFor: number = 2;
  getSeachFor2: number = 2;
  showGlobelBox: boolean = false
  searchSubscription: Subscription | undefined;
  public listTitles: any[];
  menuItems: any[];
  globelSearchData: any[] = []
  currentPage: any = 1;
  nodificationsList: any[] = [];
  permissionMenu: any[] = []
  userData: any;
  private toggleButton: any;
  location: Location;
  mobile_menu_visible: any = 0;
  private sidebarVisible: boolean;

  constructor(
    private element: ElementRef,
    private router: Router,
    private toastr: ToastrService,
    protected SERVER: ApiService,
    public authenticationService: AuthenticationService,
    private renderer: Renderer2,
  ) {
    this.placeholderText = this.placeholderTexts[0];
    interval(2000).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.placeholderTexts.length;
      this.placeholderText = this.placeholderTexts[this.currentIndex];
    });
    this.searchSubscription = this.searchInput.pipe(
      debounceTime(500), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe((searchValue) => {
      if (searchValue.length >= 1) {
        this.isShowCross = true;
        this.showGlobelBox = true;
        this.search(searchValue);
      } else {
        this.isShowCross = false
        this.showGlobelBox = false
      }
    });
  }
  // {merchant-onboarding
  //   path: "/subadmin-management",
  //   title: "Sub Admin Management",
  //   icon: "../../../assets/img/side-menu-icons/sub_admin_management.png",
  //   icon2: "../../../assets/img/side-menu-icons/sub_admin_management_active.png",
  //   class: "",
  //   slug: "subadmin_management"
  // },

  ngOnInit() {


    this.userData = localStorage.getItem("currentUser");
    this.userData = JSON.parse(this.userData);
    this.permissionMenu = this.userData?.existingUser?.adminPermission
    if (this.permissionMenu) this.permissionMenu.push('logout')
    // if (this.permissionMenu.includes("user_management") || this.permissionMenu.includes("deleted_users")) {
    //   this.permissionMenu.push("user_management_delete");
    // }
    // if (this.permissionMenu.includes("merchant_home") || this.permissionMenu.includes("merchant_onboarding") || this.permissionMenu.includes("merchant_onboarding") || this.permissionMenu.includes("business_category")) {
    //   this.permissionMenu.push("merchant_business");
    // }
    // if (this.permissionMenu && this.permissionMenu.length > 0) {
    //   ROUTES_1.forEach(route => {
    //     if (this.permissionMenu.includes(route.slug)) {
    //       ROUTES.push(route);
    //     }
    //   });
    // }
    if (this.permissionMenu && this.permissionMenu.length > 0) {
      ROUTES_1.forEach(route => {

        // let parentIncluded = false;

        if (route.subMenus && route.subMenus.length > 0) {
          // ROUTES.push(route);
          let customSubMenu = []
          route.subMenus.forEach(subMenu => {
            if (this.permissionMenu.includes(subMenu.slug)) {

              customSubMenu.push(subMenu)

              // if (!parentIncluded) {
              //   ROUTES.push({ ...route,
              //      subMenus: [] }); // Push the parent route with empty subMenus
              //   parentIncluded = true;
              // }

            }
            // ROUTES.push(subMenu);
          });
          if (customSubMenu.length > 0) {
            route.subMenus = []
            route.subMenus = customSubMenu
            ROUTES.push(route);
          }
        } else {
          if (route.slug === "subadmin_management" && (this.permissionMenu.includes("sub_admin_management") || this.permissionMenu.includes("subadmin_management"))) {
            ROUTES.push(route);
          } else if (route.slug === "notificaitons" && (this.permissionMenu.includes("notificaitons") || this.permissionMenu.includes("notificaiton"))) {
            ROUTES.push(route);
          }
          else {
            if (this.permissionMenu.includes(route.slug)) {
              ROUTES.push(route); // Push the parent route if it matches
            }
          }

        }
      });
    }
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    this.getNotifications()

  }
  callNotification() {
    this.getNotifications()
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  generateUrl(route: string, id: string): string {
    return this.router.createUrlTree([route, id]).toString();
  }
  hideGlobelBox() {
    this.showGlobelBox = false;
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  getDropDownValue(data: any) {
    if (data != 0) {

      this.getSeachFor = +data;
      this.getAdmins();
    }


  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    // this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  search(event: string) {
    // Implement your search logic here
    this.seachValue = event;
    this.currentPage = 1;
    this.getAdmins();
  }
  onSearchChange(event: any) {
    const trimmedValue = event.target.value.trim();
    this.againSearchedValue = event.target.value.trim();
    this.searchInput.next(trimmedValue); // Push the latest search value into the searchInput Subject
  }
  closeSearch() {
    this.searchInput.next('')
    this.searchInput2.nativeElement.value = '';
    this.showGlobelBox = false
  }
  getAdmins() {
    // if (this.getSeachFor === null) {
    //   this.toastr.error("error!", "Please select dropdown value");
    //   return
    // }
    if (this.seachValue === '') {
      // this.toastr.error("error!", "Please enter any search value");
      return
    }
    var payload = {
      "search": this.seachValue,
      "seachFor": this.getSeachFor
    };


    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.globalSearch,
      payload,
    ).subscribe((res) => {

      this.globelSearchData = res.data

      // this.admins = res.data;

    });
  }
  restrickedWord(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const cursorPosition = inputElement.selectionStart;
    const currentValue = inputElement.value;

    // Allow alphanumeric characters, spaces, and backspace
    const allowedKeys = /[a-zA-Z0-9\s@.]/;

    // Check if the pressed key is not alphanumeric, space, or backspace
    if (!event.key.match(allowedKeys) && event.key !== "Backspace") {
      event.preventDefault();
      return;
    }

    // Prevent space at the beginning
    if (event.key === " " && cursorPosition === 0) {
      event.preventDefault();
    }
  }
  getNotifications() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getNotification, payload,
      true,
    ).subscribe((res) => {
      // console.log(res)
      this.nodificationsList = res?.data;
      // console.log(this.nodificationsList)

    });
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }
  logutUser() {
    this.authenticationService.logout();
    // localStorage.removeItem("currentUser");
    // this.router.navigate(['/login']);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
}
