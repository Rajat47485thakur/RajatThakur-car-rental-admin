import { Component, OnInit } from "@angular/core";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";


import { User, stateResponse, Statistics } from "../models";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { notOnlyWhitespace } from "../helpers/must-match.validator";

import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'refferal',
  templateUrl: './refferal.component.html',
  styleUrls: ['./refferal.component.css']
})
export class RefferalComponent implements OnInit {
  user: any;
  userForm: FormGroup;
  loyalityPoint: FormGroup;
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    // this.user_id = this._Activatedroute.snapshot.params["id"];
  }

  ngOnInit() {
  
    this.userForm = this.fb.group({
      txnThreshold: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      refererLp: ['', [Validators.required, Validators.min(1), Validators.max(500000)]],
      refereeLp: ['', [Validators.required, Validators.min(1), Validators.max(500000)]]
    });
    // this.getUserData()
  }

  getUserData() {
    var payload = {
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getConfig,
      payload,
      true,
    ).subscribe((res: any) => { // Using 'any' or a more specific type if you know it
      this.user = (res as any).data; // Casting res to any type to access data property
      // console.log(this.user);
      this.userForm.patchValue({
        // phoneNumber: this.user.transactionValue,
        // name: this.user.pointsToEarn,
        txnThreshold: this.user?.customerReward?.txnThreshold,
        refererLp: this.user?.customerReward?.refererLp,
        refereeLp: this.user?.customerReward?.refereeLp,    
    });
    this.spinner.hide();
    });
  }
  onSubmit(): void {
    if (this.userForm.valid) {
      // console.log(this.userForm.value);
      var payload = {
        // isActive: this.toggleEvent,
        "txnThresholdForReward": this.userForm.value.txnThreshold,
    "refererLp": this.userForm.value.refererLp,
    "refereeLp": this.userForm.value.refereeLp
      };
      this.SERVER.REJECT_DOCUMENT2(
        this.SERVER.END_POINT.getConfig,
        payload,
      ).subscribe((res) => {
            this.toastr.success("Success!", res.mess);

            this.getUserData();    
       
      });
    } else {
      // Handle form errors
      this.userForm.markAllAsTouched(); // This will trigger validation messages
    }
  }

  // Helper method to check if a form control is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return control?.invalid && control?.touched;
  }
}
