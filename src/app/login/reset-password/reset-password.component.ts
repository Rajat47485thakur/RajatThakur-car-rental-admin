import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService, ApiService } from "../../services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  response: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private SERVER: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email, this.customEmailValidator]],
    });
  }

  customEmailValidator(control) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  onSubmit() {
   
    this.resetForm.markAsTouched();
    if (this.resetForm.invalid) {
      this.submitted = true;
      return;
    }
    this.loading = true;
    this.SERVER.POST_DATA(this.SERVER.END_POINT.adminReset, {
      email: this.resetForm.value.email,
    })
      .pipe(first())
      .subscribe(
        (data) => {
          localStorage.setItem("reset-emai", this.resetForm.value.email);
          this.toastr.success("Success!", data.message);
          this.router.navigate(["/verify-otp"]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        },
      );
  }
}
