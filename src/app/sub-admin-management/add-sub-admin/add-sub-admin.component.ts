import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import {
  UsersService,
  AuthenticationService,
  ApiService,
} from "../../services";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { notOnlyWhitespace } from "../../helpers/must-match.validator";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Location } from "@angular/common";

@Component({
  selector: "add-sub-admin",
  templateUrl: "./add-sub-admin.component.html",
  styleUrls: ["./add-sub-admin.component.css"],
})
export class AddSubAdminComponent implements OnInit {
  user: any = {};
  user_id: string = "";
  account_form: FormGroup;
  profile_form: FormGroup;
  config: FormGroup;
  form: FormGroup;
  resetPasswordForm: FormGroup;
  submitted = false;
  preference: FormGroup;
  showPassword: boolean = false;
  myModel: any = {};
  permissons: any = [];
  modityPermissions: any = [];
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
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required,this.customPasswordValidator]]
    });
  }

  ngOnInit() {
    this.account_form = this.fb.group({
      upi: [""],
      acc_no: [{ value: "", disabled: false }],
      credit_card: [{ value: "", disabled: false }],
      debit_card: [{ value: "", disabled: false }],
      wallet_balance: [{ value: "", disabled: true }],
    });

    this.profile_form = this.fb.group({
      first_name: ["", [Validators.required, this.noWhitespaceValidator]],
      last: ["", [Validators.required]],
      email: [{ value: "", disabled: true }],
      phone_number: [{ value: "", disabled: true }],
      role: ["", [Validators.required]],
      // dateOfBirth: [""],
      // gender: [""],
    });
    this.preference = this.fb.group({
      email: [""],
    });
    this.getUserData();
  }

  getUserData() {
    var payload = {
      _id: this.user_id,
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getSubAdminById,
      payload,
      true,
    ).subscribe((res) => {
      this.user = res.data.existingUser;
      this.spinner.hide();
      if (this.user["permissions"] && this.user["permissions"].length) {
        this.modityPermissions = this.user["permissions"][0];
      }

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
        phone_number: this.user?.phone?.countryCode +''+ this.user.phone?.phoneNumber || "",
        role: this.user?.roleDetails?.role,
      });
      this.getPermissions();
    });
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
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === " ") {
      event.preventDefault();
    }
  }
  togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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
  goBack(): void {
    this.location.back();
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
   // }
   // if (this.account_form.valid && this.profile_form.valid) {
      /** Updating user info */
      var payload = {
        _id: this.user_id,
        /*  paymentInfo: paymentInfo, */
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
      if (this.modityPermissions.length) {
        payload["permission"] = JSON.stringify(this.modityPermissions);
      }
      this.spinner.show();
      this.SERVER.POST_DATA2(
        this.SERVER.END_POINT.updateSubAdminById,
        payload,
      ).subscribe((res) => {
        this.toastr.success("Success!", "Information updated");
        this.spinner.hide();
        this.router.navigateByUrl("/subadmin-management");
      });
    //}
  }
  getPermissions() {
    var payload = {
      page: 1,
      pageSize: 20,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getPermissionMenus,
      payload,
      true,
    ).subscribe((res) => {
      this.permissons = res.data.totalUsers;
      this.permissons.forEach((element) => {
        element.hasPermission = false;
        if (this.user["permissions"] && this.user["permissions"].length) {
          if (
            this.user["permissions"][0].findIndex(
              (x) => x.menuId === element._id,
            ) >= 0
          ) {
            element.hasPermission = true;
          }
        }
      });
      this.spinner.hide();
    });
  }

  modifyPermission(event: any, item: any) {
    var obj = {
      menuId: item._id,
      menuName: item.manuName,
      slug: item.slug,
      hasPermission: true,
      _id: item._id,
    };
    if (this.modityPermissions.length) {
      var permisionIndex = this.modityPermissions.findIndex(
        (x) => x.menuId === item._id,
      );
      if (permisionIndex >= 0) {
        if (event.target["checked"]) {
          this.modityPermissions.push(obj);
        } else {
          this.modityPermissions.splice(permisionIndex, 1);
        }
      } else {
        this.modityPermissions.push(obj);
      }
    } else {
      this.modityPermissions.push(obj);
    }
  }
  customPasswordValidator(control) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }
  noWhitespaceValidator(control) {
    if (control.value && control.value.trimStart() === control.value) {
      return null; // no whitespace at the beginning, return null (no error)
    } else {
      return { startsWithSpace: true }; // whitespace detected, return an error object
    }
  }
}
