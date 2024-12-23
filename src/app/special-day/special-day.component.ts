import { Component, OnInit,AfterViewInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";

@Component({
  selector: 'special-day',
  templateUrl: './special-day.component.html',
  styleUrls: ['./special-day.component.css']
})
export class SpecialDayComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'title'"
  ];
  currentIndex = 0;
  placeholderText: string;
  modelStyle: string = "";
  isShowCross:boolean=false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  specialDays: any = [];
  attachmentModelStyle: string = "";
  attachmentModelStyle10: string = "";
  categoryDetails: any = [];
  currentPage: any = 1;
  categoryForm: FormGroup;
  updateCategory:boolean=false;
  singleUser: any = {};
  showFilter:boolean=false
  documentModelStyle:string="";
  deleteUserId: string = "";
  isSubmited:boolean=false
  toggleEvent:string=null;
  toggleId:any=null;
  activeInactiveString:string=null;
  isReset:boolean;
  totalPage: any = 0;
  attachmentModelStyle3: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
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
    this.modelStyle="none";
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, this.noWhitespaceValidator]],
      date: ['', Validators.required]
    });
    this.getSpecialOffer()
  }
  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  get date() {
    return this.categoryForm.get('date');
  }
  createNewCategory()
  {
    this.categoryForm.reset()
    this.updateCategory=false;
    this.attachmentModelStyle="block";
  }
  deleteUser() {
    var payload = {
      _id: this.singleUser._id,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.deleteSpecialDay,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.modelStyle = "none";
      this.getSpecialOffer();
    });
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
  }
  attacmentCloseModel()
  {
    this.attachmentModelStyle="none";
  }
  openDeleteModel(item: any) {
    this.singleUser = item;
    this.modelStyle = "block";
    this.deleteUserId = item.title;
  }
  getSpecialOffer() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortByOrder"] = this.sortingByValue;
    }
    // if (this.statusType) {
    //   payload["statusType"] = this.statusType;
    // }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.addSpecialDay,
      payload,
      true,
    ).subscribe((res) => {
      this.specialDays = res.data.list;
      this.totalPage = Math.ceil(res.data.totalCount / 10);
      this.spinner.hide();
    });
  }
  closeModel() {
    this.modelStyle = "none";
  }
  onSubmit() {
if(this.categoryForm.valid)
{
  if(!this.updateCategory)
    {
      var payload = {
         "title":this.categoryForm.value.categoryName,
      "date":this.categoryForm.value.date,
      };
      this.SERVER.POST_DATA2(this.SERVER.END_POINT.addSpecialDay, payload).subscribe(
        (res) => {
          this. attachmentModelStyle="none";
    this.getSpecialOffer();
          this.toastr.success("Success!", res.message);
        },
      );
    }else if (this.updateCategory){
      var payload2 = {
        "title":this.categoryForm.value.categoryName,
        "date":this.categoryForm.value.date,
        "_id":this.toggleId
      };
      this.SERVER.REJECT_DOCUMENT(this.SERVER.END_POINT.addSpecialDay, payload2).subscribe(
        (res) => {
          this.attachmentModelStyle="none";
            this.getSpecialOffer();
          this.toastr.success("Success!", res.message);
        },
      );
    }
}

  }

  activeInactiveChange2(event:string,id:any) {
   if(event === 'true')
   {
    this.activeInactiveString='Active';
   }else{
    this.activeInactiveString='Inactive';
   }
   this.toggleId=id;
   this.attachmentModelStyle3 = "block";
  }
  activeInactiveChange() {
    var payload = {
      // isActive: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT2(
      this.SERVER.END_POINT.changeStatusSpecialDay,
      payload,
    ).subscribe((res) => {
          this.toastr.success("Success!", res.mess);
          this.attachmentModelStyle3 = "none";
          this.getSpecialOffer();    
     
    });
  }
 
  editCategory(data:any)
  {
    this.updateCategory=true;
    this.categoryForm.patchValue({
      categoryName: data.title,
      date:data.date
    });
   this.toggleId=data._id
   this.attachmentModelStyle="block";
  }
  
 
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getSpecialOffer();
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

  sorting(sortingBy: string) {
    this.isSorting = true;
    this.sortingBy = sortingBy;
    this.currentOrder = !this.currentOrder;
    this.sortingByValue = this.currentOrder ? "asc" : "desc";
    this.getSpecialOffer();
  }
  
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getSpecialOffer();
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
