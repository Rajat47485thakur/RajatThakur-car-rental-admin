import { Component, OnInit,AfterViewInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import * as bootstrap from "bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
@Component({
  selector: "cms",
  templateUrl: "./cms.component.html",
  styleUrls: ["./cms.component.css"],
})
export class CmsComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Page Name'",
  ];
  currentIndex = 0;
  placeholderText: string;
  homeBannerForm: FormGroup;
  uploadedImages1: string[] = [];
  uploadedImages2: string[] = [];
  uploadedImages3: string[] = [];
  logoForm: FormGroup;
  hostDashboardForm: FormGroup;
  isShowCross:boolean=false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
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
  users: any []= [];
  submitted = false;
  roles: any = [];
  editData:any;
  deleteUserTitleName:string=''
  statusType: string = "ALL";
  currentPage: any = 1;
  deleteUserId: string = "";
  logoURL: any;
  toggleEvent:boolean;
  modelStyle: string = "";
  activeInactiveString:string=null;
  toggleId:any=null;
  totalPage: any = 0;
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  attachmentModelStyle3: string = "";
  attachmentModelStyle4: string = "";
  addUser: FormGroup;
  updateUser: any = {};

  ngOnInit(): void {
    this.modelStyle = "none";
    this.attachmentModelStyle3= "none";
    this.attachmentModelStyle4= "none";
    this.hostDashboardForm = this.formBuilder.group({
      logo: [null],
    });
    this.homeBannerForm = this.formBuilder.group({
      logo: [null],
    });
    this.logoForm = this.formBuilder.group({
      logo: [null],
    });
    this.getUsers()
    $(".showDropdown").click(function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
  }
  onFileChange(event: any,value:number): void {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if(value===1)
            {
              this.uploadedImages1.push(e.target.result);
            }else if(value===2)
            {
              this.uploadedImages2.push(e.target.result);
            }else if(value===3)
              {
                this.uploadedImages3.push(e.target.result); 
              }
         // Push base64 image to array
        };
        reader.readAsDataURL(file);
      });
    }
  }
  onFileChange3(file: any,value:number) {
    // console.log(file)
    if(file === undefined)
      {
        return
      }
    else
      {
       
        this.logoURL = file;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if(value===1)
            {
              this.homeBannerForm.patchValue({ logo: e.target.result });
            }else if(value===2)
            {
              this.logoForm.patchValue({ logo: e.target.result });
            }else if(value===3)
              {
                this.hostDashboardForm.patchValue({ logo: e.target.result });
              }
            
          };
          reader.readAsDataURL(file);
        }
      }
      
  }
  activeInactiveChange() {
    var payload = {
      status: this.toggleEvent,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.activeInactive,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.attachmentModelStyle3 = "none";
      this.getUsers();
      this.getCmsById(this.toggleId,2)
    });
  }
  closeModel() {
    this.modelStyle = "none";
  }
  getTrustedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  openDeleteModel(item: any, item2:string) {
    this.modelStyle = "block";
    this.deleteUserId = item;
    this.deleteUserTitleName = item2;
  }
  activeInactiveChange2(event:boolean,id:any) {
   if(event === true)
   {
    this.activeInactiveString='Active';
   }else{
    this.activeInactiveString='Inactive';
   }
   this.toggleEvent=event;
   this.toggleId=id;
   this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleId='';
  }
  attacmentCloseModel4() {
    this.attachmentModelStyle4 = "none";
    this.toggleId='';
  }
  getUsers() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.statusType) {
      payload["statusType"] = this.statusType;
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
      this.SERVER.END_POINT.getCMS,
      payload,
      true,
    ).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    ).subscribe((res) => {
      this.users = res.data;
      this.spinner.hide()
      // this.totalPage = Math.ceil(this.users.userCount / 10);
     ;
    }),(error) => {
      console.error('Error:', error);
      this.spinner.hide()
    };
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
  deleteUser() {
    var payload = {
      _id: this.deleteUserId,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.deleteCMS,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "CMS is Deleted");
      this.modelStyle = "none";
      this.getUsers();
    });
  }
  getCmsById(id:any,whatNumber:number) {
    var payload = {
      _id: id
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getCMSBYId,
      payload,
      true,
    ).subscribe((res) => {
      this.editData=res.data
      if(whatNumber === 1)
        {
          this.attachmentModelStyle4='block'
        }
    
      this.spinner.hide()
      // this.totalPage = Math.ceil(this.users.userCount / 10);
     ;
    }),(error) => {
      console.error('Error:', error);
      this.spinner.hide()
    };
  }
  onTabChange(tabId: string): void {
    // this.activeTab = tabId;
    // Apply functionality based on the active tab
   
  }
  submitLogoForm() {
    // console.log(this.logoURL)
    
  }
}
