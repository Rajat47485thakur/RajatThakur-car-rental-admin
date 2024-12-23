import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { trigger, state, style, transition, animate } from '@angular/animations';

import { DatePipe, Location } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
@Component({
  selector: 'merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.css']
})
export class MerchantDetailsComponent implements OnInit {
  allSelected: boolean = false;
  allSelectedList: boolean = false;
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Business ID'",
    "'Offer Title'",
    "'Business Name'",
  ];
  currentIndex = 0;
  placeholderText: string;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  isShowCross:boolean=false;
  dropdownList = [];
  selectedItems = [];
  userArray: any = [];
  users: any = [];
  ageArray: number[] = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
  ageTo: number[] = [...this.ageArray];
  ageFrom: number[] = [...this.ageArray];
  statusType: string = "ALL";
  currentPage: number = 1;
  pageSize: number = 10;
  transactionId:any=[];
  transactionId2:any=[];
  totalPage: number = 0;
  seachValue: string = "";
  fromData:any=null;
  toDate:any=null;
  sortingBy: string = "name";
  businessLogo: any;
  sortingByValue: string = "asc";
  totalUserArrayIds: any[] = [];
  isSorting: boolean = false;
  currentOrder: boolean = true;
  pusher: any = {}
  isMaleTrue:boolean=false;
  imageUrl2: any;
  isFemaleTrue:boolean=false
  title: string = "";
  body: string = "";
  logoUrl: any;
  showErrorTitle: boolean = false;
  showErrorMessage: boolean = false;
  toAge :Number;
  fromAge :Number;
  gender  :string | null = null
  getSettlementDataById:any[]=[];
  getSettlementDataById2:any[]=[];

  settlementId:any;
  attachmentModelStyle: string = "";
  attachmentModelStyle3: string = "";
  attachmentModelStyle4: string = "";
  dropdownSettings = {};
  myForm: FormGroup;
  constructor(
    private location: Location,
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private _Activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { 
    this.settlementId = this._Activatedroute.snapshot.params["id"];
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

  ngOnInit(): void {
    this.attachmentModelStyle="none";
    this.attachmentModelStyle3="none";
    this.attachmentModelStyle4="none";
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.myForm = this.formBuilder.group({
      reason: ['', [Validators.required]],
      image: ['',]
    });
    this.getSettlementDetails()
  }
  goBack(): void {
    this.location.back();
  }
  onItemSelect(item: any) {
   
  }
  onSelectAll(items: any) {
   
  }

//   seach(event: any) {
//     this.seachValue = event.target.value.trim();
//     if (this.seachValue.length > 3 || this.seachValue === "") {
//         // Extract last 10 digits if the search value contains a "+"
//         if (this.seachValue.includes('+')) {
//             this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
//         }

//         this.currentPage = 1;
//         this.getSettlementDetails();
//     }
// }
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getSettlementDetails();
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
paginationAndSorting(pagination: string) {
  if (pagination == "NEXT") {
    this.currentPage = this.currentPage + 1;
  } else if (pagination == "PREVIOUS") {
    this.currentPage = this.currentPage - 1;
  }

  this.getSettlementDetails();
}
  isAllUser(event: any) {
    this.allSelected = event.target.checked;
    if(event.target.checked=== true)
    {
      this.userArray=[]
      this.getSettlementDataById.filter(element => !element.markCompleted).forEach(element => this.userArray.push(element.transactionId));
      // this.userArray=this.totalUserArrayIds
      this.allSelectedList=false
      setTimeout(()=>{
        this.allSelectedList=true
      }, 100)
    
    }else
    {
      this.userArray=[]
      this.allSelectedList=false
    }
  }

  singleUser(event: any, item: any) {
    if(this.allSelected)
    {
      if(event.target.checked === false)
      {
        this.userArray = this.userArray.filter(item2 => item2 !== item.transactionId);
        this.allSelected=false
      }else{
        this.userArray.push(item.transactionId)
      }
    }else
    {
      if(event.target.checked === false)
      {
        this.userArray = this.userArray.filter(item2 => item2 !== item.transactionId);
      }else{
        this.userArray.push(item.transactionId)
        if(this.getSettlementDataById2.length == this.userArray.length)
        {
          this.allSelected=true
        }
        
      }
      
    }
  }
  markCompleteAll()
  {
    this.transactionId=this.userArray;
    this.attachmentModelStyle3='block'
  }
  attachment3(transactionId:any)
  {
    this.transactionId.push(transactionId)
    this.attachmentModelStyle3 = "block";
  }
  attachment4(transactionId:any)
  {
    this.transactionId2.push(transactionId)
    this.attachmentModelStyle4 = "block";
  }
  autoDeductAll()
  {
    this.transactionId2=this.userArray;
    this.autoDeductYes();
  }
  attacmentCloseModel4() {
    this.attachmentModelStyle4 = "none";
    // this.toggleEvent='';
    // this.toggleId='';
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle = "none";
    // this.toggleEvent='';
    // this.toggleId='';
  }
  attacmentCloseModel() {
    this.fromData=null;
      this.toDate=null;
    this.attachmentModelStyle = "none";
  }
  get f() { return this.myForm.controls; }

  onSubmit() {
    // Submit logic here
    if (this.myForm.invalid) {
      return;
    }
    var payload = {
      _id:this.transactionId,
      note: this.myForm.value.reason,
      image:this.businessLogo

    };
    this.SERVER.APPROVED_DOCUMENT(this.SERVER.END_POINT.singleMarkComplete, payload).subscribe(
      (res) => {
        this.toastr.success("Success!", res.message);
        this.attachmentModelStyle3="none"
        this.getSettlementDetails();
        this.imageUrl2=''
        this.myForm.reset();
        this.clearValues()
      },
    );
  }
  clearValues() {
    this.allSelected = false;
    this.allSelectedList=true
      setTimeout(()=>{
        this.allSelectedList=false
      }, 100)
    this.userArray=[]
  }
  autoDeductYes()
  {
    var payload = {
      _id:this.transactionId2,

    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.singleAutoDeduct,
      payload,
    ).subscribe((res) => {
      this.attacmentCloseModel4()
      this.toastr.success("Success!", res.message);
      this.getSettlementDetails();
      this.getSettlementDetails();
      this.clearValues()
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
  getSettlementDetails() {
    if(this.settlementId)
      {
        var payload = {
          _id: this.settlementId,
          // _id:"661df96e56f7de545620f728",
          page: this.currentPage,
          pageSize: 10,
        };
        if (this.seachValue) {
          payload["search"] = this.seachValue;
        }
        if (this.fromData) {
          payload["fromDate"] = this.fromData;
        }
        if (this.toDate) {
          payload["toDate"] = this.toDate;
        }
        this.spinner.show();
        this.SERVER.GET_DATA2(
          this.SERVER.END_POINT.getMerchantSettlement,
          payload,
          true,
        ).subscribe((res) => {
          
          this.getSettlementDataById = res.data.allData;
          this.totalPage = Math.ceil(res.data.totalData / 10);
          this.getSettlementDataById2=this.getSettlementDataById.filter(element => !element.markCompleted)
      
          this.spinner.hide();
        });
      }
      }
      applyFilter()
      {
      
        // Assuming you have your date strings
    const dateString1 = this.fromData;
    const dateString2 = this.toDate;
    
    // Convert date strings into Date objects
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    
    // Get the time value of each date
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    
    // Compare the time values
    if (time1 < time2) {
      
      this.getSettlementDetails()
      this.fromData=null;
      this.toDate=null
      this.attachmentModelStyle = "none";
    } else if (time1 > time2) {
    
      this.toastr.error("error!", "From date should not greater than To date");
    } else {
     
      this.toastr.error("error!", "From date should not equals to To date");
    }
    
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
  showDateFilter()
  {
    this.attachmentModelStyle="block";
  }
  resetDateFilter()
  {
    this.fromData=null;
      this.toDate=null
      this.attachmentModelStyle="none";
      this.getSettlementDetails()
  }
}
