import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService, ApiService } from "../../services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "verify-opt",
  templateUrl: "./verify-opt.component.html",
  styleUrls: ["./verify-opt.component.css"],
})
export class VerifyOptComponent implements OnInit {
  verify_otp: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  email: string = "abcsubadmin";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private SERVER: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.email = localStorage.getItem("reset-emai");
    this.verify_otp = this.formBuilder.group({
      otp: ["", Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.verify_otp.invalid) {
      return;
    }
    this.loading = true;
    this.SERVER.POST_DATA(this.SERVER.END_POINT.adminVerifyOtp, {
      email: this.email,
      otp: `${this.verify_otp.value.otp}`,
    })
      .pipe(first())
      .subscribe(
        (data) => {
          localStorage.setItem("accessToken", data.data.accessToken);
          this.toastr.success("Success!", data.message);
          this.router.navigate(["/change-password"]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        },
      );
  }
}
