import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
@Component({
  selector: "customer-support",
  templateUrl: "./customer-support.component.html",
  styleUrls: ["./customer-support.component.css"],
})
export class CustomerSupportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $(".showDropdown").click(function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });

    /* $('.successeModalLabel').click(function(){
      $("#success-modal").modal('show');
    }) */
  }
}
