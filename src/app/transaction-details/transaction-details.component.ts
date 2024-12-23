import * as bootstrap from "bootstrap";
import { User, stateResponse, Statistics } from "../models";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
declare var $: any;

import { formatDate } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: 'transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Transaction ID'",
    "'Customer Name'",
    "'Business Name'",
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  stateData: stateResponse;
  seachValue: string = "";
  sortingBy: string = "name";
  loading = false;
  users: any = [];
  attachmentModelCalender: string = "";
  statatics: any []=[]; // Statistics;
  singleUser: any = {};
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  modelStyle: string = "";
  currentPage: any = 1;
  totalPage: number = 0;
  deleteUserId: string = "";
  dateRangeForm: FormGroup;
  today: string;
  startDate1: Date = null;
  endDate1: Date = null;
  maxDate: string;

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: ["", [Validators.required, this.dateValidator.bind(this)]],
      endDate: ["", [Validators.required, this.dateValidator.bind(this)]]
    });
    this.placeholderText = this.placeholderTexts[0];
    interval(1000).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.placeholderTexts.length;
      this.placeholderText = this.placeholderTexts[this.currentIndex];
    });
    this.searchSubscription = this.searchInput.pipe(
      debounceTime(500), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe((searchValue) => {
      // Call your search function here with the latest search value
      if(searchValue.length >=1)
        {
this.isShowCross=true
        }else
        {
          this.isShowCross=false
        }
      this.search(searchValue);
    });
  }
  ngOnInit() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();

    this.maxDate = `${year}-${month}-${day}`;
    this.getStats()
  }
  // async getStats() {
  //   var payload = {
  //         page: this.currentPage,
  //         pageSize: 10,
  //       };
  //   this.spinner.show();
  //   this.SERVER.GET_DATA2(
  //     this.SERVER.END_POINT.recentTransactions,
  //     {},
  //     true,
  //   ).subscribe((res) => {
  //     console.log(res.data)
  //     this.statatics = res?.data?.recentTransaction;
  //     this.totalPage = Math.ceil(res.data.totalRecords / 10);
  //     this.spinner.hide();
  //   });
  // }
  async getStats() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.startDate1) {
      payload["startDate"] = this.startDate1;
    }
    if (this.endDate1) {
      payload["endDate"] = this.endDate1;
    }
    this.spinner.show();
  
    try {
      const res: any = await this.SERVER.GET_DATA2(this.SERVER.END_POINT.recentTransaction, payload, true).toPromise();
      
      // Access the data
      this.statatics = res?.data?.list;
      this.totalPage = Math.ceil(res.data.totalRecords / 10);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.spinner.hide();
    }
  }
  onKeyPress(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.target && event.target['selectionStart'] === 0 && /[0-9\s]/.test(event.key)) {
      event.preventDefault();
    }else if (event.key === " ")
    {
        event.preventDefault();
    }
  }
  attachmentModelCalenderFunction() {
    this.attachmentModelCalender = "none";
  }
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }
    this.getStats();
  }
  search(event: string) {
    // Implement your search logic here
    this.seachValue=event;
    this.currentPage = 1;
    this.getStats();
  }
  openDateRange() {
    this.attachmentModelCalender = "block";
  }
  onSearchChange(event: any) {
    const trimmedValue = event.target.value.trim();
    this.searchInput.next(trimmedValue);// Push the latest search value into the searchInput Subject
  }
  closeSearch()
  {
    this.searchInput.next('')
     this.searchInput2.nativeElement.value = '';
  }
  restrickedWord(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const cursorPosition = inputElement.selectionStart;
    const currentValue = inputElement.value;
  
    // Allow alphanumeric characters, spaces, and backspace
    const allowedKeys = /[a-zA-Z0-9\s@.]/;
    
    // Check if the pressed key is not alphanumeric, space, or backspace
    if (!event.key.match(allowedKeys) && event.key !== "Backspace") {
      event.preventDefault();
      return;
    }
  
    // Prevent space at the beginning
    if (event.key === " " && cursorPosition === 0) {
      event.preventDefault();
    }
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const todayDate = new Date(this.maxDate);

    if (inputDate > todayDate) {
      return { invalidDate: true };
    }
    return null;
  }
  get f() {
    return this.dateRangeForm.controls;
  }

  onSubmit() {
    if (this.dateRangeForm.valid) {
      const startDate = new Date(this.dateRangeForm.value.startDate);
      const endDate = new Date(this.dateRangeForm.value.endDate);
      if (startDate > endDate) {
        this.toastr.error("Error!", "Start date should not be greater than end date");
        return
      }
      this.startDate1 = this.dateRangeForm.value.startDate;
      this.endDate1 = this.dateRangeForm.value.endDate;
      this.attachmentModelCalenderFunction()
      this.getStats();
    } else {
      this.dateRangeForm.markAllAsTouched();
    }
  }
  reset() {
    this.dateRangeForm.reset()
    this.startDate1 = null;
    this.endDate1 = null;
    this.getStats();
  }

}
