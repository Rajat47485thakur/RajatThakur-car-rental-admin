import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

import { UsersService, AuthenticationService, ApiService } from "../../services";
import { Router, ActivatedRoute,NavigationStart } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

import {
  FormGroup,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: 'transaction-inner-details',
  templateUrl: './transaction-inner-details.component.html',
  styleUrls: ['./transaction-inner-details.component.css']
})
export class TransactionInnerDetailsComponent implements OnInit {
  user: any = {};
  user_id: string = "";
  account_form: FormGroup;
  profile_form: FormGroup;
  config: FormGroup;
  attachmentModelStyleSelfie: string = "";
  attachmentModelStyleGovtId: string = "";
  attachmentModelStyleEmail: string = "";
  attachmentModelStyleAddress: string = "";
  modelStyle: string = "";
  aprrovedModelStyle: string = "";
  documentModelStyle: string = "";
  showPassword: boolean = false;
  form: FormGroup;
  resetPasswordForm: FormGroup;
  submitted = false;
  isComment1: boolean = false;
  isComment2: boolean = false;
  isComment3: boolean = false;
  isComment4: boolean = false;
  comment1: string = "";
  private previousUrl: string | undefined;
  private currentUrl: string | undefined;
  comment2: string = "";
  comment3: string = "";
  comment4: string = "";
  preference: FormGroup;
  myModel: any = {};
  documentType:number;
  today: string;
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private location: Location,
  ) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
      // console.log(this.previousUrl)
      // console.log(this.currentUrl)
    });
    // console.log(this._Activatedroute)
    // console.log(this._Activatedroute.snapshot)
    // console.log(this._Activatedroute.snapshot.params["id"])
    this.user_id = this._Activatedroute.snapshot.params["id"];
    // console.log(this.user_id)
  }

  ngOnInit() {
    this.getUserData();
  }
  
  ngOnChanges() {

    this.getUserData();
  }


  // getRoutingHistory(): string[] {
  //   return this.routeHistoryService.getHistory();
  // }

  // getPreviousUrl(): string | undefined {
  //   return this.routeHistoryService.getPreviousUrl();
  // }
  getUserData() {
    var payload = {
      transactionId: this.user_id,
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.transactionDetails,
      payload,
      true,
    ).subscribe((res) => {
      this.user = res.data;
      this.spinner.hide();
    });
  }
  goBack(): void {
   
    // this.location.back();
    //  console.log(this.location)
    this.router.navigate(["/transactions"]);
  }
//  getPreviousUrl(): string | undefined {
//     return this.urlHistoryService.getPreviousUrl();
//   }
  showDocumentModel() {
    this.documentModelStyle = "block"
  }
  

 
  
 
 
}
