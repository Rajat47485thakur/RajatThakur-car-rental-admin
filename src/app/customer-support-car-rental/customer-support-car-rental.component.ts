import { Component, OnInit,AfterViewInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
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
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
@Component({
  selector: 'customer-support-car-rental',
  templateUrl: './customer-support-car-rental.component.html',
  styleUrls: ['./customer-support-car-rental.component.css']
})
export class CustomerSupportCarRentalComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Phone'",
    "'Email'",
    "'Name'"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  admins: any = [];
  priorityArray:any[]=[
    {id:0,value:'Select'},
    {id:1,value:'High'},
    {id:2,value:'Mediam'},
    {id:3,value:'Low'},
    {id:4,value:'Uregent'},
  ]
  ticketTypeArray:any[]=[
    {id:0,value:'Select'},
    {id:1,value:'Any'},
    {id:2,value:'Question'},
    {id:3,value:'Inciden'},
    {id:4,value:'Problem'},
    {id:5,value:'Task'},
  ]
  assignTiketArray:any[]=[
    {id:0,value:'Select'},
    {id:1,value:'Assignee'},
    {id:2,value:'Sub-admin'},
    {id:3,value:'User'},
    {id:4,value:'Any'},
  ]
  addSubAdmin: FormGroup;
  submitted = false;
  ticketStatus: string = "";
  assignTicket: any = 0;
  ticketType: any = 0;
  priority: any = 0;
  reqDate: string = "";
  roles: any = [];
  statusType: string = "ALL";
  currentPage: any = 1;
  totalPage: any = 0;
  toggleEvent:string=null;
  activeInactiveString:string=null;
  toggleId:any=null;
  attachmentModelStyle3: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  permissons: any = [];
  updateUser: any = {};
  modityPermissions: any = [];
  singleUser: any = {};
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
  ) { this.placeholderText = this.placeholderTexts[0];
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
    });}

  ngOnInit() {
    this. attachmentModelStyle3="none";
    this.getAdmins();
    this.getRoles();

    this.addSubAdmin = this.formBuilder.group(
      {
        firstName: ["", [Validators.required, this.noWhitespaceValidator]],
        last: ["Mr.", [Validators.required]],
        assignTo: ["", [Validators.required]],
        priority: ["", [Validators.required]],
        type: ["", [Validators.required]],
        subject: ["", [Validators.required, this.noWhitespaceValidator]],
        email: [
          "",
          [Validators.required, Validators.email, this.noWhitespaceValidator,this.customEmailValidator],
        ],
        description: [""]
        /* confirmPassword: ['', Validators.required] */
      } /* {
      validator: MustMatch('password', 'confirmPassword')
    } */,
    );
  }
  ngAfterViewInit(): void {
    $(document).on("click", ".showDropdown", function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
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
  attachment3()
  {
    this.attachmentModelStyle3 = "block";
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent='';
    this.toggleId='';
  }
  onReset() {
    this.submitted = false;
    this.addSubAdmin.reset();
  }
  loadMerchants(filter: string) {
    this.statusType = filter;
    this.currentPage=1
    // this.getMerchants();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.addSubAdmin.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.addSubAdmin.invalid) {
      return
    }
    this.SERVER.isSubmitting = true;
    var payload = {
      userName: this.addSubAdmin.value.userName,
      firstName: this.addSubAdmin.value.firstName,
      last: this.addSubAdmin.value.last,
      email: this.addSubAdmin.value.email,
      phoneNumber: this.addSubAdmin.value.phoneNumber.number,
      role: this.addSubAdmin.value.role,
      password: this.addSubAdmin.value.password,
      countryCode: this.addSubAdmin.value.phoneNumber.dialCode,
      countryCodeIso: this.addSubAdmin.value.phoneNumber.countryCode
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.addSubAdmin,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", "SubAdmin Created!");
      $(".closeModel").trigger("click");
      this.getAdmins();
      this.SERVER.isSubmitting = false;
      this.addSubAdmin.reset();
    });
  }
  getAdmins() {
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
      payload["sortOrder"] = this.sortingByValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getSubAdmins,
      payload,
      true,
    ).subscribe((res) => {
      this.admins = res.data;
      this.totalPage = Math.ceil(this.admins.userCount / 10);
      this.spinner.hide();
      this.getPermissions();
    });
  }
  getRoles() {
    var payload = {
      page: 1,
      pageSize: 10,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getAdminRoles,
      payload,
      true,
    ).subscribe((res) => {
      this.roles = res.data;
      console.log('-------------------------'+JSON.stringify(this.roles.totalUsers))
    });
  }
  loadAdmins(filter: string) {
    this.currentPage=1
    this.statusType = filter;
    this.getAdmins();
  }

  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getAdmins();
  }
  // seach(event: any) {
  //   this.seachValue = event.target.value.trim();
  //   if (this.seachValue.length > 3 || this.seachValue == "") {
  //     this.getAdmins();
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
//         this.getAdmins();
//     }
// }
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getAdmins();
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
    this.getAdmins();
  }
  getPermissions() {
    var payload = {
      page: 1,
      pageSize: 20,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getPermissionMenus,
      payload,
      true,
    ).subscribe((res) => {
      this.permissons = res.data.totalUsers;
    });
  }

  checkPermission(_id: string) {
    /**Getting SubadminPermissions */
    var payload = {
      _id: _id,
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getSubAdminById,
      payload,
      true,
    ).subscribe((res) => {
      this.spinner.hide();

      this.singleUser = res.data.existingUser;

      if (this.singleUser["permissions"].length) {
        this.modityPermissions = this.singleUser["permissions"][0];
      }
      this.permissons.forEach((element) => {
        element.hasPermission = false;
        if (this.singleUser["permissions"].length) {
          if (
            this.singleUser["permissions"][0].findIndex(
              (x) => x.menuId === element._id,
            ) >= 0
          ) {
            element.hasPermission = true;
          }
        }
      });
    });
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
      this.getAdmins();
    });
  }
  modifyPermission(event: any, item: any) {
    var obj = {
      menuId: item._id,
      menuName: item.manuName,
      slug: item.slug,
      hasPermission: true,
      _id: item._id,
    };
    if (this.modityPermissions.length) {
      var permisionIndex = this.modityPermissions.findIndex(
        (x) => x.menuId === item._id,
      );
      if (permisionIndex >= 0) {
        if (event.target["checked"]) {
          this.modityPermissions.push(obj);
        } else {
          this.modityPermissions.splice(permisionIndex, 1);
        }
      } else {
        this.modityPermissions.push(obj);
      }
    } else {
      this.modityPermissions.push(obj);
    }
  }

  updatePermission() {
    var payload = {
      _id: this.singleUser._id,
    };
    if (this.modityPermissions.length) {
      payload["permission"] = JSON.stringify(this.modityPermissions);
    }
    this.spinner.show();
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updateSubAdminById,
      payload,
    ).subscribe((res) => {
      this.spinner.hide();
      this.toastr.success("Success!", "Information updated");
      $("#permission").modal("hide");
      this.spinner.hide();
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
      this.SERVER.END_POINT.updateSubAdminById,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.attachmentModelStyle3 = "none";
      this.getAdmins();
    });
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
