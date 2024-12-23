import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
declare const $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";

@Component({
  selector: "notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.css"],
})
export class NotificationListComponent implements OnInit {
  currentPage: any = 1;
  nodificationsList:any[]=[];
  constructor(
    private element: ElementRef,
    private router: Router,
    protected SERVER: ApiService,
    private spinner: NgxSpinnerService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.getNotifications()
  }
  getNotifications() {
    this.spinner.show();
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getNotification,payload,
      true,
    ).subscribe((res) => {
      this.nodificationsList = res.data;
      this.spinner.hide();
    });
  }
}
