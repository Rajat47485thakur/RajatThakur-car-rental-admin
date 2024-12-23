import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: 'merchant-home',
  templateUrl: './merchant-home.component.html',
  styleUrls: ['./merchant-home.component.css']
})
export class MerchantHomeComponent implements OnInit {
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  activeInactiveString:string=null;
  attachmentModelStyle3: string = "";
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }
  merchants: any = [];
  submitted = false;
  roles: any = [];
  statusType: string = "ALL";
  currentPage: any = 1;
  totalPage: any = 0;
  statatics: any = {}; // Statistics;
  seachValue: string = "";
  toggleEvent:string=null;
  toggleId:any=null;
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  addUser: FormGroup;
  updateUser: any = {};

  ngOnInit(): void {
    this. attachmentModelStyle3="none";
    this.getStats()
    this.getMerchants()
    
  }
  getMerchants() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    // if (this.statusType) {
    //   payload["statusType"] = this.statusType;
    // }
    // if (this.seachValue) {
    //   payload["search"] = this.seachValue;
    // }
    // if (this.isSorting) {
    //   payload["sortBy"] = this.sortingBy;
    //   payload["sortByOrder"] = this.sortingByValue;
    // }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getMerchant,
      payload,
      true,
    ).subscribe((res) => {
      this.merchants = res.data;
      this.totalPage = Math.ceil(this.merchants.userCount / 10);
      this.spinner.hide();
    });
  }
  getStats() {
    var payload = {};
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.merchantDashboardStats,
      {},
      true,
    ).subscribe((res) => {
      this.statatics = res.data.stats; 
    });
  }
  // activeInactiveChange(event: any,id:any) {
  //   const isChecked: String = event.target["checked"];
  //   var payload = {
  //     isActive: isChecked.toString(),
  //     _id: id,
  //   };
  //   this.SERVER.REJECT_DOCUMENT(
  //     this.SERVER.END_POINT.merchantActiveInactive,
  //     payload,
  //   ).subscribe((res) => {
  //     this.toastr.success("Success!", "Information updated");
  //     this.getStats();
  //     this.getMerchants()
  //   });
  // }
  activeInactiveChange() {
    var payload = {
      isActive: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.merchantActiveInactive,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Information updated");
      this.attachmentModelStyle3 = "none";
      this.getMerchants();
    });
  }
  activeInactiveChange2(event:string,id:any) {
   if(event === 'true')
   {
    this.activeInactiveString='Active';
   }else{
    this.activeInactiveString='Inactive';
   }
   this.toggleEvent=event;
   this.toggleId=id;
   this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent='';
    this.toggleId='';
  }
}
