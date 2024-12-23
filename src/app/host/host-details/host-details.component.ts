
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { DatePipe, Location } from "@angular/common";
declare var $: any;
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { interval } from 'rxjs';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { MustMatch } from "../../helpers";


@Component({
  selector: 'host-details',
  templateUrl: './host-details.component.html',
  styleUrls: ['./host-details.component.css']
})
export class HostDetailsComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  @ViewChild('searchInput3') searchInput3: ElementRef;
  placeholderTexts: string[] = [
    "'Merchant ID'",
    "'Merchant Name'",
  ];
  placeholderText: string;
  isShowCross: boolean = false;
  currentIndex = 0;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  placeholderTexts5: string[] = [
    "'Merchant ID'",
    "'Merchant Name'",
    "'Business Name'",
    "'Business ID'",
  ];
  placeholderText5: string;
  isShowCross5: boolean = false;
  currentIndex5 = 0;
  searchInput5: Subject<string> = new Subject<string>();
  searchSubscription5: Subscription | undefined;
  statusType: string = "ALL";
  currentPage: any = 1;
  imageUrl2: any;
  currentPage2: any = 1;
  isFirstTabActive = true;
  settlement: any = [];
  withdrowellSettlement: any = []
  submitted = false;
  roles: any = [];
  // searchShow:string=
  toggleEvent: string = null;
  activeInactiveString: string = null;
  toggleId: any = null;
  activeTab: string = 'home';
  isApproved: any = null
  myForm: FormGroup;
  totalPage: any = 0;
  totalPage2: any = 0;
  seachValue: string = "";
  transactionId: string = '';
  logoUrl: any;
  businessLogo: any;
  seachValue2: string = "";
  sortingBy: number = -1;
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  attachmentModelStyle3: string = "";
  addUser: FormGroup;
  updateUser: any = {};
  host: any;
  hostIsActive: '';
  hostId: string;
  dob: any;
  aprrovedModelStyle: string = "";
  documentModelStyle: string = "";
  attachmentModelStyle4:string='';
  isComment1: boolean = false;
  isComment2: boolean = false;
  isComment3: boolean = false;
  isComment4: boolean = false;
  documentType: number;
  attachmentModelStyleLicence: string = "";
  attachmentModelStyleGovtId: string = "";
  attachmentModelStyleEmail: string = "";
  attachmentModelStyleAddress: string = "";
  modelStyle: string = "";
  comment1: string = "";
  comment2: string = "";
  comment3: string = "";
  comment4: string = "";
  preference: FormGroup;
  myModel: any = {};
  docStatus: any = {
    1: 'NOT UPLOADED',
    2: 'UPLOADED',
    3: 'PENDING WITH ADMIN',
    4: 'REJECTED',
    5: 'APPROVED',
  }

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute
  ) {

    this.route.queryParamMap.subscribe((params) => {
      this.hostId = params.get('_id');
    });

    this.placeholderText = this.placeholderTexts[0];
    interval(1000).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.placeholderTexts.length;
      this.placeholderText = this.placeholderTexts[this.currentIndex];
    });
    this.placeholderText5 = this.placeholderTexts5[0];
    interval(1000).subscribe(() => {
      this.currentIndex5 = (this.currentIndex5 + 1) % this.placeholderTexts5.length;
      this.placeholderText5 = this.placeholderTexts5[this.currentIndex5];
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
    this.searchSubscription5 = this.searchInput5.pipe(
      debounceTime(500), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe((searchValue) => {
      // Call your search function here with the latest search value
      if (searchValue.length >= 1) {
        this.isShowCross5 = true
      } else {
        this.isShowCross5 = false
      }
      this.search2(searchValue);
    });
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      reason: ['', [Validators.required]],
      image: ['',]
    });
    this.attachmentModelStyle3 = "none";
    this.getHostById()

  }



  get f() { return this.myForm.controls; }
  attachment3(id: string) {
    this.transactionId = id
    this.attachmentModelStyle3 = "block";
  }
  goBack(): void {
    this.location.back();
  }

  showDocumentModel() {
    this.documentModelStyle = "block"
  }
  closeDocumentModelStyle() {
    this.documentModelStyle = "none"
  }

  attachmentModelStyleLicenceF() {
    this.attachmentModelStyleLicence = "none"
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
  aprrovedCloseModel() {
    this.aprrovedModelStyle = "none";
  }

  approvedDocument(type: number) {
    this.documentType = type
    var payload = {
      _id: this.hostId,
      documentType: type
    };
    this.SERVER.APPROVED_DOCUMENT(
      this.SERVER.END_POINT.approvedHost,
      payload,
    ).subscribe((res) => {
      if (type === 1) {

        this.attachmentModelStyleLicenceF()
      } else if (type === 2) {
        this.attachmentModelStyleGovtIdF()

      } else if (type === 3) {
        this.attachmentModelStyleEmailF()

      } else if (type === 4) {
        this.attachmentModelStyleAddressF()
      }
      this.aprrovedModelStyle = "block";
      setTimeout(() => {
        this.aprrovedModelStyle = "none";
      }, 2000);
      this.toastr.success("Success!", res.message);
      this.getHostById();
    });
  }


  attacmentCloseModel3() {
    this.attachmentModelStyle4 = "none";
    
  }
  
  activeInactiveChange(event: string, id: any) {
    if (event === 'true') {
      this.activeInactiveString = 'Active';
    } else {
      this.activeInactiveString = 'Inactive';
    }
    this.toggleEvent = event;
    this.toggleId = id;
    this.attachmentModelStyle4 = "block";

  }

  activeInactiveChange2() {
    var payload = {
      isActive: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.merchantActiveInactive,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "Information updated");
      this.attachmentModelStyle4 = "none";
      this.getHostById();
    });
  }

  getHostById() {
    const queryParams = {
      userId: this.hostId
    };

    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getHostById,
      queryParams,
      true,
    ).subscribe((res) => {
      this.host = res?.data;
      this.hostIsActive = this.host?.isActive;

      this.spinner.hide();
    });
  }

  onFileSelected2(file: any): void {
    if (file) {
      this.logoUrl = file;
      const formdata = new FormData();
      formdata.append("file", this.logoUrl, this.logoUrl.name);

      this.SERVER.POST_DATA_WITH_HEADER_PROFILE_UPLOAD(
        this.SERVER.END_POINT.signupOnboardingLogo,
        formdata,
      ).subscribe((res) => {

        this.businessLogo = res.data.location;

      });
    }
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.imageUrl2 = e.target.result;
      };
    }
  }
  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    // Apply functionality based on the active tab
    if (tabId === 'home') {
      this.seachValue = ''
      this.getHostById()
    } else if (tabId === 'menu2') {
      this.seachValue2 = ''
      this.getSettlementWithdrawelList()
    }
  }
  getSettlementWithdrawelList() {
    var payload = {
      page: this.currentPage2,
      pageSize: 10,
    };
    if (this.seachValue2) {
      payload["search"] = this.seachValue2;
    }
    if (this.isApproved) {
      if (this.isApproved == 1) {
        payload["isApproved"] = 'false';
      }
      else if (this.isApproved == 2) {
        payload["isApproved"] = 'true';
      }

    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortByOrder"] = this.sortingByValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.settlementWidrawal,
      payload,
      true,
    ).subscribe((res) => {

      this.withdrowellSettlement = res.data.withdrawalRequest;
      this.totalPage2 = Math.ceil(res.data.totalWithdrawalRequest / 10);
      this.spinner.hide();
    });
  }
  onOptionChange(value) {

    if (value == 1 || value == 2) {
      this.currentPage2 = 1
      this.isApproved = value;
      this.getSettlementWithdrawelList();
    } else {
      this.isApproved = null;
      this.getSettlementWithdrawelList();
    }
  }
  onOptionChange2(value) {
    this.sortingBy = Number(value);
    this.getHostById()
  }
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getHostById();
  }
  paginationAndSorting2(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage2 = this.currentPage2 + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage2 = this.currentPage2 - 1;
    }

    this.getSettlementWithdrawelList();
  }
  //   seach(event: any) {
  //     this.seachValue = event.target.value.trim();
  //     if (this.seachValue.length > 3 || this.seachValue === "") {
  //         // Extract last 10 digits if the search value contains a "+"
  //         if (this.seachValue.includes('+')) {
  //             this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
  //         }

  //         this.currentPage = 1;
  //         this.getHostById();
  //     }
  // }
  search(event: string) {
    // Implement your search logic here
    this.seachValue = event;
    this.currentPage = 1;
    this.getHostById();
  }
  search2(event: string) {
    // Implement your search logic here
    this.seachValue2 = event;
    this.currentPage2 = 1;
    this.getSettlementWithdrawelList();
  }
  onSearchChange(event: any, seachNumber: string) {
    if (seachNumber === '1') {
      this.searchInput.next(event.target.value);
    }
    else if (seachNumber === '2') {
      this.searchInput5.next(event.target.value);
    }
    // Push the latest search value into the searchInput Subject
  }
  closeSearch(seachNumber: string) {
    if (seachNumber === '1') {
      this.searchInput.next('')
      this.searchInput2.nativeElement.value = '';
    }
    else if (seachNumber === '2') {
      this.searchInput5.next('')
      this.searchInput3.nativeElement.value = '';
    }

  }


  getStrongStyle2(value: boolean) {
    switch (value) {
      case false:
        return { color: "red" };
      case true:
        return { color: "green" };
      default:
        return {};
    }
  }

  showLicence() {
    this.attachmentModelStyleLicence = "block"
  }
  showGovtId() {
    this.attachmentModelStyleGovtId = "block"
  }
  showEmail() {
    this.attachmentModelStyleEmail = "block"
  }
  showAddress() {
    this.attachmentModelStyleAddress = "block"
  }

  rejectDocument(type: number) {
    this.documentType = type
    this.validateComment();
    if (type === 1 && (this.comment1 === this.host?.docs?.drivingLicence?.reason)) {
      this.toastr.warning(" ", "Nothing to update1");
      return
    }
    else if (type === 2 && (this.comment2 === this.host?.docs?.govtId?.reason)) {

      this.toastr.warning(" ", "Nothing to updat2");
      return
    }
    else if (type === 3 && (this.comment3 === this.host?.docs?.address?.reason)) {

      this.toastr.warning(" ", "Nothing to updat3");
      return
    }
    else if (type === 4 && (this.comment4 === this.host?.docs?.govtId?.reason)) {
      this.toastr.warning(" ", "Nothing to update4");
      return
    }
    if ((this.comment1 !== null && this.comment1 !== '') || (this.comment2 !== null && this.comment2 !== '') || (this.comment3 !== null && this.comment3 !== '') || (this.comment4 !== null && this.comment4 !== '')) {
      var payload = {
        _id: this.hostId,
        reason: '',
        documentType: type,
      };
      switch (type) {
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
        this.SERVER.END_POINT.rejectHost,
        payload,
      ).subscribe((res) => {
        if (res.status == 200) {

          if (type === 1) {
            this.attachmentModelStyleLicenceF()
            this.isComment1 = false
          } else if (type === 2) {

            this.attachmentModelStyleGovtIdF()
            this.isComment2 = false
          } else if (type === 3) {

            this.attachmentModelStyleEmailF()
            this.isComment3 = false
          } else if (type === 4) {
            this.attachmentModelStyleAddressF()
            this.isComment4 = false
          }

          this.modelStyle = "block";
          setTimeout(() => {
            this.modelStyle = "none";
          }, 2000);
        }
        this.toastr.success("Success!", res.message);
        this.getHostById();
      });
    } else {
      this.isComment1 = true
      this.isComment2 = true
      this.isComment3 = true
      this.isComment4 = true
    }

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

  closeModel() {
    this.modelStyle = "none";
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

}
