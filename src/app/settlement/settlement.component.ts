
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { interval } from 'rxjs';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService, AuthenticationService, ApiService } from "../services";
import { MustMatch } from "../helpers";

@Component({
  selector: 'settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  @ViewChild('searchInput3') searchInput3: ElementRef;
  placeholderTexts: string[] = [
    "'Merchant ID'",
    "'Merchant Name'",
  ];
  placeholderText: string;
  isShowCross:boolean=false;
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
  isShowCross5:boolean=false;
  currentIndex5 = 0;
  searchInput5: Subject<string> = new Subject<string>();
  searchSubscription5: Subscription | undefined;
  statusType: string = "ALL";
  currentPage: any = 1;
  imageUrl2: any;
  currentPage2: any = 1;
  isFirstTabActive = true;
  settlement: any = [];
  withdrowellSettlement:any=[]
  submitted = false;
  roles: any = [];
  // searchShow:string=
  toggleEvent:string=null;
  activeInactiveString:string=null;
  toggleId:any=null;
  activeTab: string = 'home';
  isApproved:any=null
  myForm: FormGroup;
  totalPage: any = 0;
  totalPage2: any = 0;
  seachValue: string = "";
  transactionId:string='';
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
      if(searchValue.length >=1)
        {
this.isShowCross=true
        }else
        {
          this.isShowCross=false
        }
      this.search(searchValue);
    });
    this.searchSubscription5 = this.searchInput5.pipe(
      debounceTime(500), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe((searchValue) => {
      // Call your search function here with the latest search value
      if(searchValue.length >=1)
        {
this.isShowCross5=true
        }else
        {
          this.isShowCross5=false
        }
      this.search2(searchValue);
    });
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      reason: ['', [Validators.required]],
      image: ['',]
    });
    this.attachmentModelStyle3="none";
      this.getSettlementList()
     
  }
  get f() { return this.myForm.controls; }
  attachment3(id:string)
  {
    this.transactionId=id
    this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    // this.toggleEvent='';
    // this.toggleId='';
  }
  onSubmit() {
    // Submit logic here
   
    if (this.myForm.invalid) {
      return;
    }
    
    var payload = {
      _id:this.transactionId,
      reason: this.myForm.value.reason,
      image:this.businessLogo
    };
    
    this.SERVER.APPROVED_DOCUMENT(this.SERVER.END_POINT.withdrowelApprovedByAdmin, payload).subscribe(
      (res) => {
        this.toastr.success("Success!", res.message);
        this.attachmentModelStyle3="none"
        this.getSettlementWithdrawelList();
        this.imageUrl2=''
        this.businessLogo=''
        this.myForm.reset();
      },
    );
  }
  getSettlementList() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    // if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      // payload["sortByOrder"] = this.sortingByValue;
    // }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getSettlement,
      payload,
      true,
    ).subscribe((res) => {
      this.settlement = res.data.data;
      this.totalPage = Math.ceil(res.data.totalData / 10);
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
      this.seachValue=''
      this.getSettlementList()
    } else if (tabId === 'menu2') {
      this.seachValue2=''
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
      if(this.isApproved==1)
        {
          payload["isApproved"] = 'false';
        }
        else if(this.isApproved==2)
          {
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
  onOptionChange(value)
  {

if(value == 1 || value == 2)
  {
    this.currentPage2=1
    this.isApproved=value;
    this.getSettlementWithdrawelList();
  }else
  {
    this.isApproved=null;
    this.getSettlementWithdrawelList();
  }
  }
  onOptionChange2(value)
  {
this.sortingBy=Number(value);
this.getSettlementList()
  }
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getSettlementList();
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
//         this.getSettlementList();
//     }
// }
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getSettlementList();
}
search2(event: string) {
  // Implement your search logic here
  this.seachValue2=event;
  this.currentPage2 = 1;
  this.getSettlementWithdrawelList();
}
onSearchChange(event: any,seachNumber:string) {
  if(seachNumber ==='1')
    {
      this.searchInput.next(event.target.value);
    }
    else if(seachNumber ==='2')
      {
        this.searchInput5.next(event.target.value);
      }
   // Push the latest search value into the searchInput Subject
}
closeSearch(seachNumber:string)
{
  if(seachNumber ==='1')
    {
      this.searchInput.next('')
      this.searchInput2.nativeElement.value = '';
    }
    else if(seachNumber ==='2')
      {
        this.searchInput5.next('')
   this.searchInput3.nativeElement.value = '';
      }
 
}
// seach2(event: any) {
//   this.seachValue2 = event.target.value.trim();
//   if (this.seachValue2.length > 3 || this.seachValue2 === "") {
//       // Extract last 10 digits if the search value contains a "+"
//       if (this.seachValue2.includes('+')) {
//           this.seachValue2 = this.seachValue2.substr(this.seachValue2.length - 10);
//       }

//       this.currentPage2 = 1;
//       this.getSettlementWithdrawelList();
//   }
// }
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
