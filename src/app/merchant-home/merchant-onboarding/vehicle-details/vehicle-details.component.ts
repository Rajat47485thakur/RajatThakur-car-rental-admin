import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { Validators } from 'ngx-editor';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'app/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  vehicleId: string;
  vehicle: any;
  vehicleReviewForm: FormGroup;
  selectedImage: string;
  attachmentModelStyleTPL: string = "";
  attachmentModelStyleCR: string = "";
  attachmentModelStyleOR: string = "";
  attachmentModelStyleReason: string = "";
  aprrovedModelStyle: string = "";
  documentModelStyle: string = "";
  attachmentModelStyle4: string = '';

  weeklyAvailability = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: true,
    sunday: true
  };


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    protected SERVER: ApiService,
    private spinner: NgxSpinnerService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.vehicleId = params.get('_id');
    });
  }

  ngOnInit(): void {
    this.initialization();
    this.fetchVehicleData();
  }

  initialization(): void {
    this.vehicleReviewForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onApprove(): void {
    console.log('Vehicle Approved');

    if (this.vehicleId) {
      console.log(this.vehicleReviewForm.value);
      var payload = {
        _id: this.vehicleId,
        status: 5
      };
      this.SERVER.REJECT_DOCUMENT2(
        this.SERVER.END_POINT.vehicleAproveReject,
        payload,
      ).subscribe((res) => {
        this.toastr.success("Success!", res.mess);
        this.fetchVehicleData();
      });
    }
  }

  onReject(): void {
    if (this.vehicleReviewForm.valid) {
      console.log(this.vehicleReviewForm.value);
      var payload = {
        _id: this.vehicleId,
        reason: this.vehicleReviewForm.get('reason')?.value,
        status: 4
      };
      this.SERVER.REJECT_DOCUMENT2(
        this.SERVER.END_POINT.vehicleAproveReject,
        payload,
      ).subscribe((res) => {
        this.toastr.success("Success!", res.mess);
        this.fetchVehicleData();
        this.vehicleReviewForm.reset();
      });
    } else {
      this.vehicleReviewForm.markAllAsTouched();
    }

  }

  goBack(): void {
    this.location.back();
  }

  setSelectedImage(imageUrl: string) {
    if (imageUrl) {
      this.selectedImage = imageUrl;
    }
  }

  fetchVehicleData(): void {
    this.spinner.show();

    const queryParams = {
      _id: this.vehicleId,

    };

    this.SERVER.GET_CUSTOMER_LIST(this.SERVER.END_POINT.getVehicleDetails, queryParams)
      .subscribe((res) => {
        if (this.vehicleId) {

          this.vehicle = res.data;
          this.selectedImage = this.vehicle?.images?.top || '';
          this.spinner.hide();
        }

      });
  }

  viewReason(): void {
    this.attachmentModelStyleReason = "block"
  }

  showTPL() {
    this.attachmentModelStyleTPL = "block"
  }

  showCR() {
    this.attachmentModelStyleCR = "block"
  }

  showOR() {
    this.attachmentModelStyleOR = "block"
  }

  hideReason() {
    this.attachmentModelStyleReason = "none"
  }

  attachmentModelStyleTPLHide() {
    this.attachmentModelStyleTPL = "none"

  }
  attachmentModelStyleCRHide() {
    this.attachmentModelStyleCR = "none"
  }
  attachmentModelStyleORHide() {
    this.attachmentModelStyleOR = "none"
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }

  formatTime(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
}
