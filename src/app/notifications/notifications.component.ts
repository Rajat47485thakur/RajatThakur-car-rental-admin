import { Component, OnInit } from "@angular/core";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    $(".showDropdown").click(function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
  }
}
