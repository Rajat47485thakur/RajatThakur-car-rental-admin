import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxOtpInputComponent, NgxOtpInputConfig } from "ngx-otp-input";
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { ToastrService } from "ngx-toastr";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";
@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild('otpInput') otpInput: NgxOtpInputComponent;
  loginForm: FormGroup;
  loginForm2: FormGroup;
  verify_otp: FormGroup;
  loading = false;
  isOtpValue: string = "";
  showPassword: boolean = false;
  submitted = false;
  otpTimer: number = 60;
  timerInterval: any;
  isResendDisabled: boolean;
  statusType: string = "Email";
  mobileSendOtp:boolean=false;
  returnUrl: string;
  error = "";
  mobileNumber:string=''
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: true,
    classList: {
      inputBox: "my-super-box-class",
      input: "my-super-class",
      inputFilled: "my-super-filled-class",
      inputDisabled: "my-super-disable-class",
      inputSuccess: "my-super-success-class",
      inputError: "my-super-error-class",
    },
  };
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    // let telInput: HTMLInputElement | null = document.querySelector('input[type="tel"]');
    // telInput.style.border = '1px solid #6c757d';
    // telInput.style.height = '42px';
    // telInput.style.borderRadius = '5px';
    // telInput.style.width = '100%';
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.loginForm2 = this.formBuilder.group({
      phoneNumber: ["", Validators.required]
    });
    this.verify_otp = this.formBuilder.group({
      otp: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  get f2() {
    return this.loginForm2.controls;
  }
  get f3() {
    return this.verify_otp.controls;
  }
  loadMerchants(filter: string) {
    this.statusType = filter;
    // this.currentPage=1
    // this.getBusinesses();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(["/"]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        },
      );
  }
  resendOTP() {
    // console.log('---------------')
    this.otpInput.clear();
    this.onSubmit2();
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.timerInterval);
        this.isResendDisabled = false;
      }
    }, 1000);
  }
  stopAndRestartTimer() {
    clearInterval(this.timerInterval); // Stop the current timer
    this.otpTimer = 60; // Reset the timer to 60 seconds
    this.startTimer(); // Restart the timer
  }
  preventStartingSpace(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (currentValue.length === 0 && event.key === ' ') {
      event.preventDefault();
    }
  }
  formatTimer() {
    const minutes = Math.floor(0);
    const seconds = this.otpTimer % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }
  formatTimer2() {
    const minutes = Math.floor(0);
    const seconds = this.otpTimer % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }
  padZero(value: number) {
    return value < 10 ? "0" + value : value.toString();
  }
  handeOtpChange(value: string[]): void {
    // console.log(value);
  }
  handeOtpChange2(value: string[]): void {
    // console.log(value);
  }

  handleFillEvent(value: string): void {
    // console.log(value.length);
    this.isOtpValue = value;
  }
  handleFillEvent2(value: string): void {
    // console.log(value.length);
    // this.isOtpValue2 = value;
  }
  onSubmit2() {
    // console.log(this.loginForm2.value)
    this.mobileNumber=this.loginForm2.value.phoneNumber.number
    this.mobileSendOtp=true
    this.stopAndRestartTimer();
        this.isResendDisabled = true;
    // this.submitted = true;

    // // stop here if form is invalid
    // if (this.loginForm2.invalid) {
    //   return;
    // }
    // this.loading = true;
    // this.authenticationService
    //   .login(this.f.phoneNumber.value, '')
    //   .pipe(first())
    //   .subscribe(
    //     (data) => {
    //       // this.router.navigate(["/"]);
    //     },
    //     (error) => {
    //       this.error = error;
    //       this.loading = false;
    //     },
    //   );
  }
  onSubmit3() {
    this.submitted = true;
    if (this.verify_otp.invalid) {
      return;
    }
    // console.log(this.verify_otp.value.otp)
    this.loading = true;
    // this.SERVER.POST_DATA(this.SERVER.END_POINT.adminVerifyOtp, {
    //   email: this.email,
    //   otp: `${this.verify_otp.value.otp}`,
    // })
    //   .pipe(first())
    //   .subscribe(
    //     (data) => {
    //       localStorage.setItem("accessToken", data.data.accessToken);
    //       this.toastr.success("Success!", data.message);
    //       this.router.navigate(["/change-password"]);
    //     },
    //     (error) => {
    //       this.error = error;
    //       this.loading = false;
    //     },
    //   );
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  
}
}
