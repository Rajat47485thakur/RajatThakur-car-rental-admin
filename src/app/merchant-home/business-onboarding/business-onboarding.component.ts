import { Component, OnInit,AfterViewInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { Router,ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";

@Component({
  selector: 'business-onboarding',
  templateUrl: './business-onboarding.component.html',
  styleUrls: ['./business-onboarding.component.css']
})
export class BusinessOnboardingComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Merchant Name'",
    "'Business Name'",
    "'Id"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  attachmentModelStyle: string = "";
  attachmentModelStyle4: string = "";
  attachmentModelStyle2: string = "";
  attachmentModelStyle5: string = "";
  users: any = [];
  roles: any = [];
  category:any=[];
  getData:any=[]
  showFilter:boolean=false
  id:any=null
  documentUrl:any;
  logoUrl:any;
  statusType2: string = "ALL";
  documentStatusName:string[]=[]
  isUploaded:boolean=false;
  responseMessage:string=null;
  isReject:boolean=false;
  activeInactiveString:string=null;
  isApproved:boolean=false;
  isNotUploaded:boolean=false;
  isPendingFromdmin:boolean=false;
  categoryName:any=null;
  update:boolean=false;
  isComment:boolean=false;
  comment: string = "";
  statusType: string = "ALL";
  toggleEvent:string=null;
  toggleId:any=null;
  user_id: string = "";
  businessLogo:any;
  businessCertificate:any;
  currentPage: any = 1;
  totalPage: any = 0;
  attachmentModelStyle3: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  addUser: FormGroup;
  imageUrl: any;
  imageUrl2: any;
  updateUser: any = {};
  constructor(private fb: FormBuilder,
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,private renderer: Renderer2,
    private el: ElementRef,
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
    
      if(searchValue.length >=1)
        {
         this.isShowCross=true
        }else
        {
          this.isShowCross=false
        }
      this.search(searchValue);
    });
    this.user_id = this._Activatedroute.snapshot.params["id"];
    if(this.user_id)
      {
        this.viewMerchantDetails(this.user_id,'')
      }
  }

  ngOnInit(): void {
    this.getBusinesses()
    this. attachmentModelStyle="none"
    this. attachmentModelStyle4="none"
  }
  getBusinesses()
{
  var payload = {
    page: this.currentPage,
    pageSize: 10,
  };
  if (this.statusType) {
    payload["statusType"] = this.statusType;
  }
  if (this.documentStatusName.length>0) {
    payload["documentStatusName"] = this.documentStatusName;
  }
  if (this.seachValue) {
    payload["search"] = this.seachValue;
  }
  if (this.isSorting) {
    payload["sortBy"] = this.sortingBy;
    payload["sortByOrder"] = this.sortingByValue;
  }
  this.spinner.show();
  this.SERVER.GET_DATA2(
    this.SERVER.END_POINT.getBusinessessOnboarding,
    payload,
    true,
  ).subscribe((res) => {
    
    this.users = res.data.business;
    this.totalPage = Math.ceil(res.data.totalBusiness / 10);
    this.spinner.hide();
  });
}

getStrongStyle(value: number) {
  switch (value) {
    case 1:
      return { color: "red" };
    case 2:
      return { color: "#D2AD2A" };
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
showFilterFunction()
{
  this.showFilter = !this.showFilter
}
pushTypeChange(event: any, value: string) {
  if(event.target.checked && value==="Rejected")
  {
    this.isReject=true
  }else if(!event.target.checked && value==="Rejected")
  {
    this.isReject=false
  }
  else if(event.target.checked && value==="Approved")
  {
    this.isApproved=true
  }
  else if(!event.target.checked && value==="Approved")
  {
    this.isApproved=false
  }
  else if(event.target.checked && value==="Not Uploaded")
  {
    this.isNotUploaded=true
  }
  else if(!event.target.checked && value==="Not Uploaded")
  {
    this.isNotUploaded=false
  }
  else if(event.target.checked && value==="Pending With Admin")
  {
    this.isPendingFromdmin=true
  }
  else if(!event.target.checked && value==="Pending With Admin")
  {
    this.isPendingFromdmin=false
  }
  else if(event.target.checked && value==="Uploaded")
  {
    this.isUploaded=true
  }
  else if(!event.target.checked && value==="Uploaded")
  {
    this.isUploaded=false
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
applyFilter()
{
  this.currentPage=1;
  this.statusType2=this.statusType
  this.showFilter=false;
  this.getBusinesses();
}
resetFilter()
{
  this.statusType='ALL';
  this.statusType2='ALL';
  this.documentStatusName=[];
  this.isReject=false;
  this.isApproved=false;
  this.isNotUploaded=false;
  this.isPendingFromdmin=false;
  this.isUploaded=false;
  this.loadMerchants('ALL');
  this.getBusinesses();
  this.showFilter=false
}
paginationAndSorting(pagination: string) {
  if (pagination == "NEXT") {
    this.currentPage = this.currentPage + 1;
  } else if (pagination == "PREVIOUS") {
    this.currentPage = this.currentPage - 1;
  }
  this.getBusinesses();
}
sorting(sortingBy: string) {
  this.isSorting = true;
  this.sortingBy = sortingBy;
  this.currentOrder = !this.currentOrder;
  this.sortingByValue = this.currentOrder ? "asc" : "desc";
  this.getBusinesses();
}
// seach(event: any) {
//   this.seachValue = event.target.value.trim();

//   if (this.seachValue.length > 3 || this.seachValue === "") {
//       // Extract last 10 digits if the search value contains a "+"
//       if (this.seachValue.includes('+')) {
//           this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
//       }

//       this.currentPage = 1;
//       this.getBusinesses();
//   }
// }
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getBusinesses();
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
loadMerchants(filter: string) {
  this.statusType = filter;
  this.currentPage=1
  // this.getBusinesses();
}
  attachment()
  {
    this.attachmentModelStyle = "block";
  }
  attacmentCloseModel() {
    this.attachmentModelStyle = "none";
  }
  attachment2()
  {
    this.attachmentModelStyle2 = "block";
  }
  attacmentCloseModel2() {
    this.attachmentModelStyle2 = "none";
  }
  viewMerchantDetails(id:any,categoryName:any)
  {
    this.categoryName=categoryName
    this.id=id
    var payload = {
      _id:id
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getMerchantOnboardingBusinessById,
      payload,
      true,
    ).subscribe((res) => {
      this.getData=res.data.business
      
      if(this.getData)
      {
        this.comment=this.getData?.document?.reason;
      }
      this.spinner.hide();
      this.attachmentModelStyle4 = "block";
    });
   
  }
  attacmentCloseModel4()
  {
    this.attachmentModelStyle4 = "none";
    this.comment=null
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent='';
    this.toggleId='';
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
   activeInactiveChange() {
     var payload = {
       isActive: this.toggleEvent,
       _id: this.toggleId,
     };
     this.SERVER.REJECT_DOCUMENT(
       this.SERVER.END_POINT.updateBusiness,
       payload,
     ).subscribe((res) => {
      if(res?.data?.message)
        {
this.responseMessage=res.data.message
this.attachmentModelStyle3 = "none";
this.attachmentModelStyle5="block"
        } else if(!(res?.data?.message))
          {
            this.toastr.success("Success!", "Information updated");
            this.attachmentModelStyle3 = "none";
            this.getBusinesses();
          }
      
     });
   }
   attacmentCloseModel5() {
    this.attachmentModelStyle5 = "none";
   
  }

   approvedDocument() {
    var payload = {
      _id: this.getData._id
    };
    this.SERVER.APPROVED_DOCUMENT(
      this.SERVER.END_POINT.approvedBusiness,
      payload,
    ).subscribe((res) => {
        // this.attachmentModelStyle4 = "block";
        // setTimeout(() => {
          this.attachmentModelStyle4 = "none";
          // this.closeDocumentModelStyle()
        // }, 2000);
      this.getBusinesses();
      this.toastr.success("Success!", res.message);
    });
  }
  rejectDocument() {
    if(this.comment !== null && this.comment !== '')
    {
    if(this.comment === this.getData?.document?.reason)
    {   
      this.toastr.warning(" ", "Nothing to update");
      return
    }
   
      var payload = {
        _id: this.getData._id,
        reason: this.comment,
      };
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.rejectBusiness,
        payload,
      ).subscribe((res) => {
        if (res.status == 200) {
          this.attachmentModelStyle4 = "none";
          // this.modelStyle = "block";
          // setTimeout(() => {
          //   this.modelStyle = "none";
          //   this.closeDocumentModelStyle()
          // }, 2000);
          this.comment=null
        }
        this.getBusinesses();
        this.toastr.success("Success!", res.message);
        this.isComment=false;
      });
    }else
    {
      this.isComment=true
    }
   
  }
}
