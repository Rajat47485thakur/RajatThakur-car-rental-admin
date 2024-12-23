import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Email ID'",
    "'Phone No'",
    "'Customer Name'"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross: boolean = false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  attachmentModelStyle: string = "";
  attachmentModelStyle2: string = "";
  attachmentModelStyle3: string = "";
  merchants: any = [];
  merchantDataById: any = [];
  statusType: string = "ALL";
  statusTypeText: string = '';
  statusType2: string = "ALL";
  currentPage: any = 1;
  docs1: any;
  toggleEvent: string = null;
  toggleId: any = null;
  isReject: boolean = false;
  pdfView: boolean = false
  pdfView2: boolean = false
  activeInactiveString: string = null;
  isApproved: boolean = false;
  isNotUploaded: boolean = false;
  isPendingFromdmin: boolean = false;
  isUploaded: boolean = false;
  isComment: boolean = false;
  showFilter: boolean = false
  docs2: any;
  documentModelStyle: string = ""
  comment: string = "";
  merchant_id: any = null;
  user_id: string = "";
  isReset: boolean;
  totalPage: any = 0;
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  customers: any = [];
  addUser: FormGroup;
  documentStatusName: string[] = []
  updateUser: any = {};

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private _Activatedroute: ActivatedRoute,
  ) {
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
      if (searchValue.length >= 1) {
        this.isShowCross = true
      } else {
        this.isShowCross = false
      }
      this.search(searchValue);
    });
    this.user_id = this._Activatedroute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.attachmentModelStyle = "none";
    this.attachmentModelStyle2 = "none";
    this.attachmentModelStyle3 = "none";
    this.documentModelStyle = "none",
      this.fetchCustomerData();
  }

  attachment() {
    this.attachmentModelStyle = "block";

  }
  attacmentCloseModel() {
    this.attachmentModelStyle = "none";
  }
  attachment2() {
    this.attachmentModelStyle2 = "block";
  }
  attacmentCloseModel2() {
    this.attachmentModelStyle2 = "none";
  }

  attachment3() {
    this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent = '';
    this.toggleId = '';
  }

  closeDocumentModelStyle() {
    this.documentModelStyle = "none"
    this.comment = null
  }
  pushTypeChange(event: any, value: string) {
    if (event.target.checked && value === "Rejected") {
      this.isReject = true
    } else if (!event.target.checked && value === "Rejected") {
      this.isReject = false
    }
    else if (event.target.checked && value === "Approved") {
      this.isApproved = true
    }
    else if (!event.target.checked && value === "Approved") {
      this.isApproved = false
    }
    else if (event.target.checked && value === "Not Uploaded") {
      this.isNotUploaded = true
    }
    else if (!event.target.checked && value === "Not Uploaded") {
      this.isNotUploaded = false
    }
    else if (event.target.checked && value === "Pending With Admin") {
      this.isPendingFromdmin = true
    }
    else if (!event.target.checked && value === "Pending With Admin") {
      this.isPendingFromdmin = false
    }
    else if (event.target.checked && value === "Uploaded") {
      this.isUploaded = true
    }
    else if (!event.target.checked && value === "Uploaded") {
      this.isUploaded = false
    }
    if (event.target.checked) {
      this.documentStatusName.push(value);
    } else {
      const index = this.documentStatusName.indexOf(value);
      if (index !== -1) {
        this.documentStatusName.splice(index, 1);
      }
    }
  }
  getMerchants() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.statusType) {
      payload["statusType"] = this.statusType;
    }
    if (this.documentStatusName.length > 0) {
      payload["documentStatusName"] = this.documentStatusName;
    }
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortOrder"] = this.sortingByValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getMerchant,
      payload,
      true,
    ).subscribe((res) => {
      this.merchants = res.data;
      this.totalPage = Math.ceil(this.merchants.userCount / 5);
      this.spinner.hide();
    });
  }
  // seach(event: any) {
  //   this.seachValue = event.target.value.trim();
  //   if (this.seachValue.length > 3 || this.seachValue == "") {
  //     this.currentPage=1
  //     this.getMerchants();
  //   }
  // }
  //   seach(event: any) {
  //     this.seachValue = event.target.value.trim();

  //     if (this.seachValue.length > 3 || this.seachValue === "") {
  //         // Extract last 10 digits if the search value contains a "+"
  //         if (this.seachValue.includes('+')) {
  //             this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
  //         }

  //         this.currentPage = 1;
  //         this.getMerchants();
  //     }
  // }
  search(event: string) {
    // Implement your search logic here
    this.seachValue = event;
    this.currentPage = 1;
    this.fetchCustomerData();
  }
  onSearchChange(event: any) {
    const trimmedValue = event.target.value.trim();
    this.searchInput.next(trimmedValue);// Push the latest search value into the searchInput Subject
  }
  closeSearch() {
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
  loadMerchants(filter: string) {
    this.statusType = filter;
    this.currentPage = 1
    // this.getMerchants();
  }
  applyFilter() {
    this.currentPage = 1;
    this.statusType2 = this.statusType
    this.showFilter = false;
    this.getMerchants();
  }
  resetFilter() {
    this.statusType = 'ALL';
    this.statusType2 = 'ALL';
    this.documentStatusName = [];
    this.isReject = false;
    this.isApproved = false;
    this.isNotUploaded = false;
    this.isPendingFromdmin = false;
    this.isUploaded = false;
    this.loadMerchants('ALL');
    this.getMerchants();
    this.showFilter = false
  }
  showFilterFunction() {
    this.showFilter = !this.showFilter
  }
  // loadMerchantsDocuments(filter: string)
  // {
  //   this.statusTypeText = filter;
  //   this.documentStatusName.push(filter)
  //   this.getMerchants();
  // }
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }
    this.fetchCustomerData();
  }
  sorting(sortingBy: string) {
    this.isSorting = true;
    this.sortingBy = sortingBy;
    this.currentOrder = !this.currentOrder;
    this.sortingByValue = this.currentOrder ? "asc" : "desc";
    this.getMerchants();
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
  getMerchandById2(_id: any): void {
    this.router.navigate(['/customers/customers-details'], {
      queryParams: { _id: _id }
    });
  }
  
  rejectDocument() {
    if (this.comment === this.merchantDataById?.documentuploaded[0]?.reason && this.merchantDataById?.documentuploaded[0]?.reason !== '') {
      this.toastr.warning(" ", "Nothing to update");
      return
    }
    if (this.comment !== null && this.comment !== '') {
      var payload = {
        _id: this.merchant_id,
        reason: this.comment,
      };
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.rejectMerchantByAdmin,
        payload,
      ).subscribe((res) => {
        if (res.status == 200) {
        }
        this.documentModelStyle = "none"
        this.comment = null
        this.getMerchants()
        this.toastr.success("Success!", res.message);
        // this.getMerchandById(this.merchant_id);
      });
    } else {
      this.isComment = true
      return
    }


  }
  approvedDocument() {
    var payload = {
      _id: this.merchant_id
    };
    this.SERVER.APPROVED_DOCUMENT(
      this.SERVER.END_POINT.approvedMerchantByAdmin,
      payload,
    ).subscribe((res) => {
      this.documentModelStyle = "none"
      this.comment = null
      this.getMerchants()
      this.toastr.success("Success!", res.message);
    });
  }
  activeInactiveChange() {
    var payload = {
      isActive: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.merchantActiveInactive,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Information updated");
      this.attachmentModelStyle3 = "none";
      this.fetchCustomerData();
    });
  }
  activeInactiveChange2(event: string, id: any) {
    if (event === 'true') {
      this.activeInactiveString = 'Active';
    } else {
      this.activeInactiveString = 'Inactive';
    }
    this.toggleEvent = event;
    this.toggleId = id;
    this.attachmentModelStyle3 = "block";
  }

  fetchCustomerData(): void {
    this.spinner.show();

    const queryParams = {
      page: this.currentPage,
      pageSize: 10,
      statusType: 'ALL',
      search:this.seachValue
    };

    this.SERVER.GET_CUSTOMER_LIST(this.SERVER.END_POINT.getCustomerList, queryParams)
      .subscribe((res) => {
        this.customers = res.data;
        this.totalPage = Math.ceil(this.customers.userCount / 10);
        this.spinner.hide();

      });
  }

  getShortName(name: string): string {
    return name.length > 15 ? name.slice(0, 15) + '...' : name;
  }
}
