import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
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
  selector: 'deleted-users',
  templateUrl: './deleted-users.component.html',
  styleUrls: ['./deleted-users.component.css']
})
export class DeletedUsersComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  placeholderTexts: string[] = [
    "'Manual ID'",
    "'Name'",
    "'Email'"
  ];
  currentIndex = 0;
  placeholderText: string;
  isShowCross:boolean=false;
  separateDialCode = false;
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
  users: any []= [];
  submitted = false;
  roles: any = [];
  singleUser: any = {};
  statusType: string = "ALL";
  currentPage: any = 1;
  toggleEvent:string=null;
  statusTypeDeleted:boolean;
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
this.getDeletedUsers()
  }
  getDeletedUsers() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getDeletedUser,
      payload,
      true,
    ).subscribe((res) => {
      this.users = res.data.data;
  
      this.totalPage = Math.ceil(res.data.totalData / 10);
      this.spinner.hide();
    });
  }

  getStrongStyle(value: number) {
    switch (value) {
      case 2:
        return { color: "red" };
      case 3:
        return { color: "green" };
      case 0:
        return { color: "#D2AD2A" };
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

    this.getDeletedUsers();
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleId='';
  }
  seach(event: any) {
    this.seachValue = event.target.value.trim();
    if (this.seachValue.length > 3 || this.seachValue === "") {
        // Extract last 10 digits if the search value contains a "+"
        if (this.seachValue.includes('+')) {
            this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
        }

        this.currentPage = 1;
        this.getDeletedUsers();
    }
}
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getDeletedUsers();
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
    this.getDeletedUsers();
  }
  onReset() {
    this.submitted = false;
    this.addUser.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.addUser.controls;
  }
  closeModel() {
    this.modelStyle = "none";
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
      this.getDeletedUsers();
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
      // this.getUsers();
    });
  }
  customEmailValidator(control) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  activeInactiveChange() {
    var payload = {
      status:this.statusTypeDeleted,
      _id: this.toggleId,
    };
    this.SERVER.REJECT_DOCUMENT(
      this.SERVER.END_POINT.approvedRejectDeleteRequest,
      payload,
    ).subscribe((res) => {
      this.toastr.success("Success!", res.message);
      this.attachmentModelStyle3 = "none";
      this.getDeletedUsers();
      // this.getUsers();
    });
  }
  openDeleteModel(item: any) {
    this.singleUser = item;
    this.modelStyle = "block";
    this.deleteUserId = item.manualUserId;
  }
  activeInactiveChange2(id:any,customTrueFalse:boolean) {
this.statusTypeDeleted=customTrueFalse
   this.toggleId=id;
   this.attachmentModelStyle3 = "block";
  }

}
