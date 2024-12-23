import { Component, OnInit,AfterViewInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../../helpers";

@Component({
  selector: 'business-category',
  templateUrl: './business-category.component.html',
  styleUrls: ['./business-category.component.css']
})
export class BusinessCategoryComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Category Name'",
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  category: any = [];
  attachmentModelStyle: string = "";
  attachmentModelStyle10: string = "";
  attachmentModelForcefully: string = "";
  categoryDetails: any = [];
  merchantDataById: any = [];
  currentPage: any = 1;
  isComment:boolean=false;
  categoryForm: FormGroup;
  myForm: FormGroup;
  inactiveReason:string=''
  users:any=[]
  statusType: string = "ALL";
  updateCategory:boolean=false
  showFilter:boolean=false
  categoryName:string=null;
  docs2:string=null;
  documentModelStyle:string=""
  comment: string = "";
  merchant_id:any=null;
  isSubmited:boolean=false
  toggleEvent:string=null;
  isCategoryName:boolean=false
  isCategoryName2:boolean=false
  toggleId:any=null;
  activeInactiveString:string=null;
  messageWithArray:string=null;
  isReset:boolean;
  totalPage: any = 0;
  attachmentModelStyle3: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
  forceFullyIsActive:boolean;
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
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
    this.attachmentModelStyle10="none";
    this.attachmentModelForcefully="none";
    this.myForm = this.formBuilder.group({
      reason: ['', [Validators.required]]
    });
    this.categoryForm = this.formBuilder.group({
      categoryName2: ['', [Validators.required, this.noWhitespaceValidator]]
    });
    this.getBusinessCategory()
  }
  noWhitespaceValidator(control) {
    const value = control.value;
    if (value && value.trim() === '') {
      return { 'whitespace': true };
    }
    return null;
  }

  get categoryName2() {
    return this.categoryForm.get('categoryName2');
  }
  createNewCategory()
  {
    this.categoryForm.reset()
    this.categoryName='';
    this.updateCategory=false;
    this.attachmentModelStyle="block";
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
  attacmentCloseModel10()
  {
    this.attachmentModelStyle10 = "none";
    this.messageWithArray=null;
  }
  attacmentCloseModel()
  {
    this.attachmentModelStyle="none";
    this.categoryName=''
  }
  getBusinessCategory() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortOrder"] = this.sortingByValue;
    }
    if (this.statusType) {
      payload["statusType"] = this.statusType;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getCategory,
      payload,
      true,
    ).subscribe((res) => {
      this.category = res.data.categories;
      this.totalPage = Math.ceil(res.data.totalCategories / 10);
      this.spinner.hide();
    });
  }
  getBusinessCategoryById() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
      _id:"65fc14debc1e3fa3e16e530e"
    };
   
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getCategoryById,
      payload,
      true,
    ).subscribe((res) => {
      this.categoryDetails = res.data;
      this.totalPage = Math.ceil(this.categoryDetails.userCount / 10);
      this.spinner.hide();
    });
  }
  onSubmit() {
this.isCategoryName=false
if(!this.updateCategory)
  {
    var payload = {
      "categoryName": this.categoryForm.value.categoryName2
    };
    this.SERVER.POST_DATA2(this.SERVER.END_POINT.createCategory, payload).subscribe(
      (res) => {
        this. attachmentModelStyle="none";
  this.getBusinessCategory();
        this.toastr.success("Success!", "Category Created!");
      },
    );
  }else if (this.updateCategory){
    var payload2 = {
      "categoryName": this.categoryForm.value.categoryName2,
      "_id":this.toggleId
    };
    this.SERVER.REJECT_DOCUMENT(this.SERVER.END_POINT.updateCategory, payload2).subscribe(
      (res) => {
        this.attachmentModelStyle="none";
  this.getBusinessCategory();
        this.toastr.success("Success!", "Category Updated!");
      },
    );
  }
  }
  activeInactiveNotChange(event:string,id:any)
  {
    this.toggleEvent=event;
    this.toggleId=id;
    this.activeInactiveChange()
  }
  categoryEvent(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const valueWithoutSpaces = inputElement.value.replace(/\s/g, '');
    const caretPosition = inputElement.selectionStart;
  
    if (event.key === ' ' && caretPosition === 0) {
      event.preventDefault();
      return;
    }
    // if (event instanceof KeyboardEvent) {

    //   if (this.categoryName.length > 0) {
    //     this.isCategoryName = false;
    //   } else {
    //     this.isCategoryName = true;
    //   }
    // }
  }
//   updateCategoryFunction()
//   {
//     if(this.categoryName === '' || this.categoryName === null || this.categoryName === undefined || !this.categoryName || /^\s/.test(this.categoryName))
// {
//   this.isCategoryName=true
//   return
// }
//     var payload = {
//       "categoryName": this.categoryName,
//       "_id":this.toggleId
//     };
//     this.SERVER.REJECT_DOCUMENT(this.SERVER.END_POINT.updateCategory, payload).subscribe(
//       (res) => {
//         this.attachmentModelStyle="none";
//   this.getBusinessCategory();
//         this.toastr.success("Success!", "Category Updated!");
//       },
//     );
//   }
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
      this.SERVER.END_POINT.updateCategory,
      payload,
    ).subscribe((res) => {
      if(Object.keys(res.data).length === 0)
        {
      
          this.toastr.success("Success!", "Information updated");
          this.attachmentModelStyle3 = "none";
          this.getBusinessCategory();
        }
        else  {
          if(res.data.length > 0 && this.toggleEvent === 'false')
         
            this.users=res.data
            this.messageWithArray=res.message
            this.attachmentModelStyle3 = "none";
            this.attachmentModelStyle10="block";
          }
     
    });
  }
  navigateToBusinessOnboarding() {
    this.router.navigate(['/business-onboarding']);
  }
  editCategory(data:any)
  {
    this.updateCategory=true;
    this.categoryForm.patchValue({
      categoryName2: data.categoryName || false,
    });
   this.toggleId=data._id
   this. attachmentModelStyle="block";
  }
  loadUsers(filter: string) {
   this.statusType=filter;
   this.currentPage=1;
   this.getBusinessCategory()
  }
  // seach(event: any) {
  //   this.seachValue = event.target.value.trim();
  //   if (this.seachValue.length > 3 || this.seachValue == "") {
  //     this.getBusinessCategory();
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
//         this.getBusinessCategory();
//     }
// }
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getBusinessCategory();
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
    this.getBusinessCategory();
  }
  
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getBusinessCategory();
  }
  get f() { return this.myForm.controls; }

  onSubmit2() {
    // Submit logic here
    if (this.myForm.invalid) {
      this.isSubmited=true
      return;
    }
    this.inactiveReason=this.myForm.value.reason
    // Process the form data if it's valid
    this.attachmentModelForcefully="block";
  }
  attachmentModelForcefully2()
  {
    this.attachmentModelForcefully='none';
    this.attachmentModelStyle10="none";
    this.isSubmited=false;
    this.myForm.reset()
  }
  cancelAttachmentModelForcefully2()
  {
    this.attachmentModelForcefully='none';
    this.attachmentModelStyle10="none";
    this.isSubmited=false
    this.myForm.reset()
  }
  inActiveForcefully()
  {
    var payload = {
      "_id":this.toggleId,
      "isActive":'false',
      "isForceInactive":true,
      "inactiveReason":this.inactiveReason,
  }
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.updateCategory,
      payload,
    ).subscribe((res) => {
     this.myForm.reset()
     this.getBusinessCategory()
     this.toastr.success("Success!", res.message);
     this.attachmentModelForcefully='none';
     this.attachmentModelStyle10="none";
    });
  }
}
