import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";

import { User, stateResponse, Statistics } from "../models";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { notOnlyWhitespace } from "../helpers/must-match.validator";
import { Location } from "@angular/common";

import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { books_v1 } from "googleapis";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit, OnChanges {
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
    this.user_id = this._Activatedroute.snapshot.params["id"];
    this.today = new Date().toISOString().split("T")[0];
  }

  ngOnInit() {
    this.modelStyle = "none";
    this.aprrovedModelStyle = "none";
    this.attachmentModelStyleSelfie = "none"
    this.attachmentModelStyleGovtId = "none";
    this.attachmentModelStyleEmail = "none";
    this.attachmentModelStyleAddress = "none"
    this.documentModelStyle = "none"
    this.account_form = this.fb.group({
      upi: ["", [Validators.required, this.noWhitespaceValidator]],
      acc_no: [{ value: "", disabled: false }],
      credit_card: [{ value: "", disabled: false }],
      debit_card: [{ value: "", disabled: false }],
      wallet_balance: [{ value: "", disabled: true }],
    });

    this.profile_form = this.fb.group({
      first_name: ["", [Validators.required, this.noWhitespaceValidator]],
      last: ["Mr.", [Validators.required]],
      email: [{ value: "", disabled: true }],
      phone_number: [{ value: "", disabled: true }],
      dateOfBirth: [""],
      gender: [""],
    });
    this.preference = this.fb.group({
      email: [""],
    });
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, this.customPasswordValidator]]
    });
    this.getUserData();
  }
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === " ") {
      event.preventDefault();
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnChanges() {

    // this.getUserData();
  }

  showSelfie() {
    this.attachmentModelStyleSelfie = "block"
  }
  showEmail() {
    this.attachmentModelStyleEmail = "block"
  }
  showGovtId() {
    this.attachmentModelStyleGovtId = "block"
  }
  showAddress() {
    this.attachmentModelStyleAddress = "block"
  }
  attachmentModelStyleSelfieF() {
    this.attachmentModelStyleSelfie = "none"
    this.isComment1 = false

  }
  attachmentModelStyleGovtIdF() {
    this.attachmentModelStyleGovtId = "none"
    this.isComment2 = false
  }
  attachmentModelStyleEmailF() {
    this.attachmentModelStyleEmail = "none"
    this.isComment3 = false
  }
  attachmentModelStyleAddressF() {
    this.attachmentModelStyleAddress = "none"
    this.isComment4 = false
  }
  customPasswordValidator(control) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }
  getUserData() {

    var payload = {
      _id: this.user_id,
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.geUserById,
      payload,
      true,
    ).subscribe((res) => {
      this.user = res.data.existingUser;
      this.comment1=this.user?.selfieReason;
      this.comment4=this.user?.govtIdReason;
      this.comment2=this.user?.emailReason;
      this.comment3=this.user?.addressReason;
      /** Payment Form */
      this.account_form.patchValue({
        upi: this.user.paymentInfo?.upi || "",
        acc_no: this.user.paymentInfo?.acc_no || "",
        credit_card: this.user.paymentInfo?.credit_card || "",
        debit_card: this.user.paymentInfo?.debit_card || "",
        wallet_balance: this.user.balance?.mainWallet || "",
      });

      /** Config Form */

      this.preference.patchValue({
        email: this.user?.preferences?.email || false,
      });

      /** Frofile form */

      this.profile_form.patchValue({
        first_name: this.user.name?.first || "",
        last: this.user.name?.last || "Mr.",
        email: this.user.email?.email || "",
        phone_number: this.user?.phone?.countryCode + '' + this.user.phone?.phoneNumber || "",
        dateOfBirth: this.user?.dateOfBirth ? formatDate(
          new Date(this.user?.dateOfBirth),
          "yyyy-MM-dd",
          "en",
        ) : '',
        gender: this.user?.gender,
      });
      this.spinner.hide();
    });
  }
  goBack(): void {
    // this.location.back();
    this.router.navigate(["/user-management"]);
  }
  activeInactiveChange(event: any) {
    const isChecked: String = event.target["checked"];
    var payload = {
      isActive: isChecked.toString(),
      _id: this.user_id,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Information updated");
      this.getUserData();
    });
  }
  showDocumentModel() {
    this.documentModelStyle = "block"
  }
  closeDocumentModelStyle() {
    this.documentModelStyle = "none"
  }
  validateComment() {
    if (this.comment1 && this.comment1.length > 0) {
      this.comment1 = this.comment1.trimStart();
    } 
    else if (this.comment2 && this.comment2.length > 0) {
      this.comment2 = this.comment2.trimStart();
    }
    else if (this.comment3 && this.comment3.length > 0) {
      this.comment3 = this.comment3.trimStart();
    }
    else if (this.comment4 && this.comment4.length > 0) {
      this.comment4 = this.comment4.trimStart();
    }
  }
  rejectDocument(type: number) {
    this.documentType=type
    this.validateComment();
    if ( type === 1 && (this.comment1 === this.user?.selfieReason)) {
      this.toastr.warning(" ", "Nothing to update1");
      return
    }
    else if (type === 4 && (this.comment4 === this.user?.govtIdReason)) {
   
      this.toastr.warning(" ", "Nothing to updat2");
      return
    }
    else if (type === 2 && (this.comment2 === this.user?.emailReason)) {
     
      this.toastr.warning(" ", "Nothing to updat3");
      return
    }
    else if (type === 3 && (this.comment3 === this.user?.addressReason)) {
      this.toastr.warning(" ", "Nothing to update4");
      return
    }
    if ((this.comment1 !== null && this.comment1 !== '') || (this.comment2 !== null && this.comment2 !== '') || (this.comment3 !== null && this.comment3 !== '') || (this.comment4 !== null && this.comment4 !== '')) {
      var payload = {
        _id: this.user_id,
        reason: '',
        documentType: type,
      };
      switch(type) {
        case 1:
          payload.reason = this.comment1;
          break;
        case 2:
          payload.reason = this.comment2;
          break;
        case 3:
          payload.reason = this.comment3;
          break;
        case 4:
          payload.reason = this.comment4;
          break;
      }
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.rejectUserProfile,
        payload,
      ).subscribe((res) => {
        if (res.status == 200) {

          if (type === 1) {
            this.attachmentModelStyleSelfieF()
            this.isComment1 = false
          } else if (type === 2) {

            this.attachmentModelStyleEmailF()
            this.isComment2 = false
          } else if (type === 3) {

            this.attachmentModelStyleAddressF()
            this.isComment3 = false
          } else if (type === 4) {
            this.attachmentModelStyleGovtIdF()
            this.isComment4 = false
          }
          
          this.modelStyle = "block";
          setTimeout(() => {
            this.modelStyle = "none";
            // this.closeDocumentModelStyle()
          }, 2000);
        }
        this.getUserData();
        this.toastr.success("Success!", res.message);
      });
    } else {
      this.isComment1 = true
      this.isComment2 = true
      this.isComment3 = true
      this.isComment4 = true
    }

  }
  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit3() {
    if (this.resetPasswordForm.invalid) {
      this.submitted = true;
      return;
    }
    var payload = {
      password: this.resetPasswordForm.value.newPassword,
      _id: this.user_id,
      self: false
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.userResetPassword,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.resetPasswordForm.reset()
    });
    // Form is valid, proceed with submission logic
    this.getUserData()
  }
  approvedDocument(type: number) {
    this.documentType=type
    var payload = {
      _id: this.user_id,
      documentType: type
    };
    this.SERVER.APPROVED_DOCUMENT(
      this.SERVER.END_POINT.approvedUserProfile,
      payload,
    ).subscribe((res) => {
      if (type === 1) {

        this.attachmentModelStyleSelfieF()
      } else if (type === 2) {

        this.attachmentModelStyleEmailF()
      } else if (type === 3) {

        this.attachmentModelStyleAddressF()
      } else if (type === 4) {


        this.attachmentModelStyleGovtIdF()
      }
      this.aprrovedModelStyle = "block";
      setTimeout(() => {
        this.aprrovedModelStyle = "none";
        // this.closeDocumentModelStyle()
      }, 2000);
      this.getUserData();
      this.toastr.success("Success!", res.message);
    });
  }

  submitAll() {
    //if (this.account_form.valid) {
    var paymentInfo = {
      upi: this.account_form.value.upi,
      acc_no: this.account_form.value.acc_no,
      credit_card: this.account_form.value.credit_card,
      debit_card: this.account_form.value.debit_card,
    };

    /** Updating paymentinfo */
    //}

    //if (this.preference.valid) {
    var preferences = {
      email: this.preference.value.email,
      sms: false,
      push: false,
    };
    //}

    //if (this.account_form.valid && this.profile_form.valid) {
    /** Updating user info */
    var payload = {
      _id: this.user_id,
      paymentInfo: paymentInfo,
      preferences: preferences,
      firstName: this.profile_form.value.first_name,
      last: this.profile_form.value.last,
    };
    if (this.profile_form.value.dateOfBirth) {
      payload["dateOfBirth"] = new Date(
        this.profile_form.value.dateOfBirth,
      ).getTime();
    }
    if (this.profile_form.value.gender) {
      payload["gender"] = this.profile_form.value.gender;
    }
    this.spinner.show();
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Information updated");
      this.spinner.hide();
      this.router.navigateByUrl("/user-management");
      //this.getUserData()
    });
    //}
  }
  closeModel() {
    this.modelStyle = "none";
  }
  aprrovedCloseModel() {
    this.aprrovedModelStyle = "none";
  }
  noWhitespaceValidator(control) {
    if (control.value && control.value.trimStart() === control.value) {
      return null; // no whitespace at the beginning, return null (no error)
    } else {
      return { startsWithSpace: true }; // whitespace detected, return an error object
    }
  }
  getStrongStyle(value: number) {
    switch (value) {
      case 1:
        return { color: "red" };
      case 2:
        return { color: "green" };
      case 3:
        return { color: "#D2AD2A" };
      case 4:
        return { color: "red" };
      case 5:
        return { color: "green" };
      default:
        return {};
    }
  }
}
