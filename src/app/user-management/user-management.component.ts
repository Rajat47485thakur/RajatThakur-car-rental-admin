import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
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
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
@Component({
  selector: "user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"]
})
export class UserManagementComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Manual ID'",
    "'Name'",
    "'Phone'",
    "'Email'"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
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
    this.modelStyle="none";
    let telInput: HTMLInputElement | null = document.querySelector('input[type="tel"]');
    telInput.style.border = '1px solid #6c757d';
    telInput.style.height = '42px';
    telInput.style.borderRadius = '5px';
    telInput.style.width = '100%';

    $(".showDropdown").click(function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
    this.getUsers();
    this.addUser = this.formBuilder.group({
      userName: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          this.noWhitespaceValidator,
        ],
      ],
      firstName: ["", [Validators.required, this.noWhitespaceValidator]],
      last: ["Mr.", [Validators.required]],
      // lastName: ["", [this.noWhitespaceValidator]],
      email: [
        "",
        [Validators.required, Validators.email, this.noWhitespaceValidator,this.customEmailValidator],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          // Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          // this.noWhitespaceValidator,
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          // this.customPasswordValidator,
          this.noWhitespaceValidator,
        ],
      ],
    });
    this.renderer.setAttribute(this.el.nativeElement.querySelector('form'), 'autocomplete', 'off');
    window.onload = function() {
      var form = document.getElementsByTagName('form')[0];
      form.setAttribute('autocomplete', 'off');
  };
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
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India];
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
      this.SERVER.END_POINT.getUsers,
      payload,
      true,
    ).subscribe((res) => {
      this.users = res.data;
      this.totalPage = Math.ceil(this.users.userCount / 10);
      this.spinner.hide();
    });
  }
  onOptionChange2(value)
  {

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
      last: this.addUser.value.last,
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
  deleteUser() {
    var payload = {
      isDeleted: "true",
      _id: this.singleUser._id,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "User is Deleted");
      this.modelStyle = "none";
      this.getUsers();
    });
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
  
}
