import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
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

@Component({
  selector: "push-notification",
  templateUrl: "./push-notification.component.html",
  styleUrls: ["./push-notification.component.css"],
})
export class PushNotificationComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }
  users: any = [];
  birthdayForm: FormGroup;
  badgeArray:any[]=[
    {id:'5',data:'⭐⭐⭐⭐⭐'},
    {id:'4',data:'⭐⭐⭐⭐'},
    {id:'3',data:'⭐⭐⭐'},
    {id:'2',data:'⭐⭐'},
    {id:'1',data:'⭐'}
  ]
  location:any[]=[
    {id:'karnal',data:'Karnal'},
    {id:'delhi',data:'Delhi'},
    {id:'Mumbai',data:'Mumbai'},
    {id:'Chandighar',data:'Chandighar'},
    {id:'Mohali',data:'Mohali'}
  ]
  ageArray: number[] = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
  ageTo: number[] = [...this.ageArray];
  ageFrom: number[] = [...this.ageArray];
  statusType: string = "AgeGroup";
  currentPage: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  seachValue: string = "";
  maxDate: string;
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  totalUserArrayIds: any[] = [];
  isSorting: boolean = false;
  startDate1: Date = null;
  endDate1: Date = null;
  currentOrder: boolean = true;
  pusher: any = {}
  pusher2: any = {}
  isMaleTrue:boolean=false
  isFemaleTrue:boolean=false
  title: string = "";
  body: string = "";
  showErrorTitle: boolean = false;
  showErrorMessage: boolean = false;
  allSelected: boolean = false;
  allSelectedList: boolean = false;
  userArray: any = [];
  toAge :Number;
  fromAge :Number;
  fromBadge:string;
  selectedLocation:string | null | undefined=undefined
  toBadge:string;
  gender  :string | null = null
  ngOnInit(): void {
    this.pusher = {
      all: false,
      email: false,
      sms: false,
      push: false
    }
    this.pusher2 = {
      Location: false,
      Badge: false,
      AgeGroup: false,
      Birthday: false
    }
    this.getUsers();
    this.birthdayForm = this.formBuilder.group({
      birthday: [""],
    });
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();

    this.maxDate = `${year}-${month}-${day}`;
  }
  loadMerchants(filter: string) {
    this.statusType = filter;
    this.currentPage=1
    // this.getMerchants();
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const todayDate = new Date(this.maxDate);

    if (inputDate > todayDate) {
      return { invalidDate: true };
    }
    return null;
  }
  getUsers() {
    var payload = {
      page: this.currentPage,
      pageSize: this.pageSize,
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

    if(this.fromAge && this.toAge) {
      payload["fromAge"] = this.fromAge;
      payload["toAge"] = this.toAge;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getUsers,
      payload,
      true,
    ).subscribe((res) => {
      this.users = res.data;
      this.totalUserArrayIds=this.users.totalUsers.map(item=>item._id)
      this.totalPage = Math.ceil(this.users.userCount / 10);
      this.spinner.hide();
    });
  }
  onSubmit() {
    if (this.birthdayForm.valid) {
      // const startDate = new Date(this.dateRangeForm.value.startDate);
      // const endDate = new Date(this.dateRangeForm.value.endDate);
      // if (startDate > endDate) {
      //   this.toastr.error("Error!", "Start date should not be greater than end date");
      //   return
      // }
      // this.startDate1 = this.dateRangeForm.value.startDate;
      // this.endDate1 = this.dateRangeForm.value.endDate;
      // this.attachmentModelCalenderFunction()
      // this.getStats();
    } else {
      // this.dateRangeForm.markAllAsTouched();
    }
  }
  reset() {
    this.birthdayForm.reset()
    this.startDate1 = null;
    this.endDate1 = null;
    // this.getStats();
  }
  pagination(event: any) {
    this.currentPage = event;
    this.getUsers();
  }

  pushTypeChange(event: any, pusher: string) {
    const isChecked = event.target.checked;
    if (pusher == 'ALL') {
      if (isChecked) {
        this.pusher.email = true;
        this.pusher.sms = true;
        this.pusher.push = true;
        this.pusher.all = true;
      }
      else {
        this.pusher.email = false;
        this.pusher.sms = false;
        this.pusher.push = false;
        this.pusher.all = false;
      }
    }
    else if (pusher == 'SMS') {
      this.pusher.sms = isChecked;
      this.checkAllChecked();
    }
    else if (pusher == 'EMAIL') {
      this.pusher.email = isChecked;
      this.checkAllChecked();
    }
    else if (pusher == 'PUSH') {
      this.pusher.push = isChecked;
      this.checkAllChecked();
    }
  }
  
  pushTypeChange2(event: any, pusher: string) {
    const isChecked = event.target.checked;
    if (pusher == 'Location') {
      this.pusher2.Location = isChecked;
    }
    else if (pusher == 'Badge') {
      this.pusher2.Badge = isChecked;
    }
    else if (pusher == 'AgeGroup') {
      this.pusher2.Badge = isChecked;
    }
    else if (pusher == 'Birthday') {
      this.pusher2.Badge = isChecked;
    }
  }
  checkAllChecked() {
    if (this.pusher.sms && this.pusher.push && this.pusher.email) {
      this.pusher.all = true;
    }
    else {
      this.pusher.all = false;
    }
  }

  isAllUser(event: any) {
    this.allSelected = event.target.checked;
    if(event.target.checked=== true)
    {
      this.userArray=this.totalUserArrayIds
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
        this.userArray = this.userArray.filter(item2 => item2 !== item._id);
        this.allSelected=false
      }else{
        this.userArray.push(item._id)
      }
      // this.allSelected = (this.userArray.length == 0) ? true : false;
    }else
    {
      if(event.target.checked === false)
      {
        this.userArray = this.userArray.filter(item2 => item2 !== item._id);
      }else{
        this.userArray.push(item._id)
        if(this.totalUserArrayIds.length == this.userArray.length)
        {
          this.allSelected=true
        }
        
      }
      
    }
  }
  // singleUser(event: any, item: any) {
  //   var ischecked = false;
  //   if (event.target.checked == true) {
  //     ischecked = true
  //   }

  //   if (ischecked) {
  //     this.userArray.push(item._id)
  //   }
  //   else {
      
  //     this.userArray = this.userArray.filter(item2 => item2 !== item._id);
  //   }
  //   this.allSelected = (this.userArray.length == 0) ? true : false;
  // }
  sendPush() {
    /** Validate title and body */
    this.showErrorTitle = this.title.trim().length === 0;
    this.showErrorMessage = this.body.trim().length === 0;
    if (!this.pusher.sms && !this.pusher.push && !this.pusher.email) {
      this.toastr.error('', 'Please select any notification type');
      return false;
    }

    if (this.showErrorTitle || this.showErrorMessage) {
      return false;
    }

    var newPusher = { ...this.pusher };
    delete newPusher['all'];
    var reqObj = {
      title: this.title,
      body: this.body,
      pusherType: newPusher,
      allSelected: this.allSelected
    }
    if (!this.allSelected) {

      if (this.userArray.length == 0) {
        this.toastr.error('', 'Please select any user!');
        return false;
      }
      reqObj['userId'] = this.userArray;
    }

    if(this.fromAge && this.toAge) {
      reqObj['filter'] ={
        fromAge: this.fromAge,
        toAge: this.toAge
      };
    }
    this.spinner.show();
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.sendNotification,
      reqObj,
    ).subscribe((res) => {
      this.toastr.success("", "Notification Sent!");
     
      this.clearValues();
      this.spinner.hide();
    });

  }
  applyFilter() {
    if(this.toAge || this.fromAge)
    {
      if(this.fromAge >= this.toAge || !this.toAge  || !this.fromAge) {
        this.toastr.error('','Please select correct age range');
        return false;
      } 
    }
    this.allSelected = false;
    this.allSelectedList= false;
    this.userArray=[]
    this.getUsers()
    $("#filters").modal('hide');
  }
  applyResetFilter() {
    this.toAge=undefined
    this.fromAge=undefined
    this.allSelected = false;
    this.allSelectedList= false;
    this.userArray=[]
    this.getUsers()
    $("#filters").modal('hide');
  }
  clearValues() {
    this.title = "";
    this.body = "";
    this.pusher.email = false;
        this.pusher.sms = false;
        this.pusher.push = false;
        this.pusher.all = false;
    this.allSelected = false;
    this.allSelectedList=true
      setTimeout(()=>{
        this.allSelectedList=false
      }, 100)
    this.userArray=[]
  }
  genderSubmit(value: string) {
    if (value == '1') {
      this.isMaleTrue = !this.isMaleTrue;
      if (this.isMaleTrue) {
        this.isFemaleTrue = false;
        this.gender = value;
      } else {
        this.gender = null;
      }
    } else if (value == '2') {
      this.isFemaleTrue = !this.isFemaleTrue;
      if (this.isFemaleTrue) {
        this.isMaleTrue = false;
        this.gender = value;
      } else {
        this.gender = null;
      }
    }
  }
}