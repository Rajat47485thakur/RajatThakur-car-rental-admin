import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
@Component({
  selector: "review-rating",
  templateUrl: "./review-rating.component.html",
  styleUrls: ["./review-rating.component.css"],
})
export class ReviewRatingComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  reviewForm: FormGroup;
  respontForm: FormGroup;
  percentages: number[] = [];
  placeholderTexts: string[] = [
    "'Manual ID'",
    "'Name'",
    "'Phone'",
    "'Email'"
  ];
  currentIndex = 0;
  showPopup:string=''
  placeholderText: string;
  attachmentModelEditReview:string=''
  isShowCross:boolean=false;
  separateDialCode = false;
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { 
    this.attachmentModelEditReview="none";
    this.respontForm = this.formBuilder.group({
      respont: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.reviewForm = this.formBuilder.group({
      review: ['', [Validators.required, Validators.maxLength(1000)]]
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
  users: any = [];
  submitted = false;
  
  roles: any = [];
  singleUser: any = {};
  statusType: string = "ALL";
  currentPage: any = 1;
  toggleEvent:string=null;
  activeInactiveString:string=null;
  toggleId:any=null;
  totalPage: any = 0;
  modelStyle: string = "";
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  deleteUserId: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  attachmentModelStyle3: string = "";
  addUser: FormGroup;
  updateUser: any = {};
  ngOnInit(): void {
    this.attachmentModelStyle3="none";
    this.getUsers();
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
 
  getUsers() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    // if (this.statusType) {
    //   payload["statusType"] = this.statusType;
    // }
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortByOrder"] = this.sortingByValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getReviewAndRatig,
      payload,
      true,
    ).subscribe((res) => {
      this.users = res.data;
      if(this.users)
        {
          this.calculatePercentages()
        }
      // this.totalPage = Math.ceil(this.users.userCount / 10);
      this.spinner.hide();
    });
  }
  calculatePercentages(): void {
    const values = [
      this.users?.averageRating?.ratingCounts[1], 
      this.users?.averageRating?.ratingCounts[2], 
      this.users?.averageRating?.ratingCounts[3], 
      this.users?.averageRating?.ratingCounts[4], 
      this.users?.averageRating?.ratingCounts[5]
    ];
    const total = values.reduce((sum, value) => sum + value, 0);
    
    if (total === 0) {
      this.percentages = values.map(() => 0);
    } else {
      // this.percentages = values.map(value => (value / total) * 100);
      this.percentages = values.map(value => Math.round((value / total) * 100));
    }
  }
  attachment3()
  {
    this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent='';
    this.toggleId='';
  }
  loadUsers(filter: string) {
    this.statusType = filter;
    this.getUsers();
  }
  attachmentModelEditReviewFunction()
  {
    this.attachmentModelEditReview="none"
  }
  formatNumber(item: string): string {
let num=+item;
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return (num / 1000000).toFixed(1) + 'm';
    }
  }
  get reviewFormControl() {
    return this.reviewForm.controls;
  }
  get respontFormControl() {
    return this.respontForm.controls;
  }
  onSubmit2() {
    // Handle form submission
    if (this.reviewForm.valid) {
      // Submit the form
      var payload = {
        review: this.reviewForm.value.review,
        _id: this.toggleId,
      };
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.updateReview,
        payload,
      ).subscribe((res) => {
        this.toastr.success("Success!", "Review Updated");
        this.attachmentModelEditReview = "none";
        this.getUsers();
      });
    } else {
      // Form is invalid, display error messages
      console.error("Form is invalid");
    }
  }
  onSubmit3() {
    // Handle form submission
    if (this.respontForm.valid) {
      // Submit the form
      var payload = {
        reply: this.respontForm.value.respont,
        _id: this.toggleId,
      };
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.replyToReview,
        payload,
      ).subscribe((res) => {
        this.toastr.success("Success!");
        this.attachmentModelEditReview = "none";
        this.getUsers();
      });
    } else {
      // Form is invalid, display error messages
      console.error("Form is invalid");
    }
  }
  deleteUser() {
    var payload = {
      _id: this.toggleId,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.deleteReview,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Review Deleted");
      this.attachmentModelEditReview = "none";
      this.getUsers();
    });
  }
  reprtedUser() {
    var payload = {
      _id: this.toggleId,
      isReported : true
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.repotedReview,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Reported Success");
      this.attachmentModelEditReview = "none";
      this.getUsers();
    });
  }
  editReviewAndRatings(id:string,review:string,popup:string)
  {
    this.reviewForm.reset()
    this.respontForm.reset()
    this.showPopup=popup
    if(this.showPopup === 'edit')
      {
        this.reviewForm.patchValue({
          review: review,
        });
      }
    this.toggleId=id;
   
    this.attachmentModelEditReview="block"
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
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getUsers();
  }
  // seach(event: any) {
  //   this.seachValue = event.target.value.trim();
  //   if (this.seachValue.length > 3 || this.seachValue == "") {
  //     this.getUsers();
  //   }
  // }
  seach(event: any) {
    this.seachValue = event.target.value.trim();
    if (this.seachValue.length > 3 || this.seachValue === "") {
        // Extract last 10 digits if the search value contains a "+"
        if (this.seachValue.includes('+')) {
            this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
        }

        this.currentPage = 1;
        this.getUsers();
    }
}
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getUsers();
}
onSearchChange(event: any) {
  const trimmedValue = event.target.value.trim();
  this.searchInput.next(trimmedValue); // Push the latest search value into the searchInput Subject
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
  sorting(sortingBy: string) {
    this.isSorting = true;
    this.sortingBy = sortingBy;
    this.currentOrder = !this.currentOrder;
    this.sortingByValue = this.currentOrder ? "asc" : "desc";
    this.getUsers();
  }
  onReset() {
    this.submitted = false;
    this.addUser.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.addUser.controls;
  }
  resetForm() {
    let telInput: HTMLInputElement | null = document.querySelector('input[type="tel"]');
    telInput.style.border = '1px solid #6c757d';
    telInput.style.height = '42px';
    telInput.style.borderRadius = '5px';
    telInput.style.width = '100%';
    this.submitted = false;
  }
  closeModel() {
    this.modelStyle = "none";
  }
  onSubmit() {

    this.submitted = true;
    if (this.addUser.invalid) {
      return;
    }
    this.SERVER.isSubmitting = true;
    var payload = {
      userName: this.addUser.value.userName,
      firstName: this.addUser.value.firstName,
      email: this.addUser.value.email,
      phoneNumber: this.addUser.value.phoneNumber.number,
      password: this.addUser.value.password,
      countryCode: this.addUser.value.phoneNumber.dialCode,
      countryCodeIso: this.addUser.value.phoneNumber.countryCode

    };
    this.SERVER.POST_DATA2(this.SERVER.END_POINT.addUser, payload).subscribe(
      (res) => {
        this.toastr.success("Success!", "User Created!");
        $(".closeModel").trigger("click");
      this.SERVER.isSubmitting = false;
        this.getUsers();
        this.addUser.reset();
      },
    );
  }
  noWhitespaceValidator(control) {
    if (control.value && (control.value.trimStart() === control.value || control.value.length === 0)) {
      return null; // no whitespace at the beginning, return null (no error)
    } else {
      return { startsWithSpace: true }; // whitespace detected, return an error object
    }
  }
  customPasswordValidator(control) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }
  changeAdminStatus(status: string, _id: string) {
    this.updateUser = {
      user_id: _id,
      status: status,
    };
  }
  updateUserStatus() {
    var payload = {
      isActive: this.updateUser.status == "enable" ? "true" : "false",
      _id: this.updateUser.user_id,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      if (this.updateUser.status == "enable") {
        $("#enable").modal("hide");
        this.updateUser["userAction"] = "Enabled";
      } else {
        $("#disable").modal("hide");
        this.updateUser["userAction"] = "Disabled";
      }
      $("#documentModalSuccess").modal("show");
      this.getUsers();
    });
  }
  customEmailValidator(control) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  activeInactiveChange() {
    var payload = {
      isActive: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.attachmentModelStyle3 = "none";
      this.getUsers();
    });
  }
  openDeleteModel(item: any) {
    this.singleUser = item;
    this.modelStyle = "block";
    this.deleteUserId = item.manualUserId;
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
  exportToExcel(): void {
    const columns = ['Total Reviews', 'Average Rating', '5 Star Ratings Count', '4 Star Ratings Count', '3 Star Ratings Count', '2 Star Ratings Count', '1 Star Ratings Count'];
    const data = [
      {
        'Total Reviews': this.users?.averageRating?.totalReviews,
        'Average Rating': this.users?.averageRating?.averageRating,
        '5 Star Ratings Count': this.users?.averageRating?.ratingCounts[5],
        '4 Star Ratings Count': this.users?.averageRating?.ratingCounts[4],
        '3 Star Ratings Count': this.users?.averageRating?.ratingCounts[3],
        '2 Star Ratings Count': this.users?.averageRating?.ratingCounts[2],
        '1 Star Ratings Count': this.users?.averageRating?.ratingCounts[1]
      }
    ];
    this.exportToExcel2(columns, data, 'exported_data');
  }
  exportToCsv(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, `${fileName}.csv`);
  }

  exportToPdf(columns: string[], data: any[], fileName: string): void {
    const doc = new jsPDF();
    const rows = data.map(item => columns.map(col => item[col]));
    (doc as any).autoTable({
      head: [columns],
      body: rows
    });
    doc.save(`${fileName}.pdf`);
  }
  exportToExcel2(columns: string[], data: any[], fileName: string): void {
    // Create a worksheet from the data
    const wsData = [columns, ...data.map(item => columns.map(col => item[col]))];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    
    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Write the workbook to a file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  exportCSV(): void {
    
    var data = [
      {
        'Total Reviews': this.users?.averageRating?.totalReviews,
        'Average Rating': this.users?.averageRating?.averageRating,
        '5 Star Ratings Count': this.users?.averageRating?.ratingCounts[5],
        '4 Star Ratings Count': this.users?.averageRating?.ratingCounts[4],
        '3 Star Ratings Count': this.users?.averageRating?.ratingCounts[3],
        '2 Star Ratings Count': this.users?.averageRating?.ratingCounts[2],
        '1 Star Ratings Count': this.users?.averageRating?.ratingCounts[1]
      }
    ];
    this.exportToCsv(data, 'csv');
  }
  exportPDF(): void {
    // const columns = ['Registed user', 'New Users', 'Total Merchants','Total Balance','Total Businesses','Total Transactions','Pending Invoice'];
    // var data = [
    //   { 'Registed user': this.statatics.registered_users,
    //   'New Users': this.statatics.new_users,
    //    'Total Merchants': this.statatics.total_merchants,
    //  'Total Businesses': this.statatics.total_businesses,
    //    'Total Balance': this.statatics.total_balance,
    //   'Total Transactions': this.statatics.total_tnx,
    //    'Pending Invoice': this.statatics.pending_invoices},
    // ];
    const columns = ['Total Reviews', 'Average Rating', '5 Star Ratings Count', '4 Star Ratings Count', '3 Star Ratings Count', '2 Star Ratings Count', '1 Star Ratings Count'];
    const data = [
      {
        'Total Reviews': this.users?.averageRating?.totalReviews,
        'Average Rating': this.users?.averageRating?.averageRating,
        '5 Star Ratings Count': this.users?.averageRating?.ratingCounts[5],
        '4 Star Ratings Count': this.users?.averageRating?.ratingCounts[4],
        '3 Star Ratings Count': this.users?.averageRating?.ratingCounts[3],
        '2 Star Ratings Count': this.users?.averageRating?.ratingCounts[2],
        '1 Star Ratings Count': this.users?.averageRating?.ratingCounts[1]
      }
    ]
    this.exportToPdf(columns, data, 'data');
  }
}
