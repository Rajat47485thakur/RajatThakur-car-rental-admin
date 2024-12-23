import { Component, OnInit, Renderer2, ElementRef,ViewChild} from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { interval } from 'rxjs';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

@Component({
  selector: "view-points",
  templateUrl: "./view-points.component.html",
  styleUrls: ["./view-points.component.css"],
})
export class ViewPointsComponent implements OnInit {
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
  users: any = [];
  submitted = false;
  private previousUrl: string | undefined;
  private currentUrl: string | undefined;
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
  user_id: string = "";
  sortingBy: number =0;
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  attachmentModelStyle3: string = "";
  updateUser: any = {};
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private renderer: Renderer2,
    private _Activatedroute: ActivatedRoute,
    private el: ElementRef
  ) {
    this.user_id = this._Activatedroute.snapshot.params["id"];
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
      // this.search(searchValue);
    });
  }

  ngOnInit(): void {
this.getLoyaltyPoints()
  }
  onOptionChange2(value)
  {
this.sortingBy=Number(value);
this.currentPage = 1;
this.getLoyaltyPoints()
  }
  getLoyaltyPoints() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
      // userId: "6631ce45b40318d849639024",
      userId: this.user_id,
      // markCompleted:this.sortingBy
      type:this.sortingBy===0 ? 'Credit':'Debit'
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getLoyaltyById,
      payload,
      true,
    ).subscribe((res) => {
      // console.log(res)
      this.users=res?.data
      this.totalPage = Math.ceil(this.users.totalRecords / 10);
      this.spinner.hide();
    });
  }
  loadUsers(filter: string) {
    this.statusType = filter;
    this.currentPage=1;
    this.getLoyaltyPoints();
  }

 
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getLoyaltyPoints();
  }

  seach(event: any) {
    this.seachValue = event.target.value.trim();
    if (this.seachValue.length > 3 || this.seachValue === "") {
        // Extract last 10 digits if the search value contains a "+"
        if (this.seachValue.includes('+')) {
            this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
        }

        this.currentPage = 1;
        this.getLoyaltyPoints();
    }
}
search(event: string) {
  // Implement your search logic here
  this.seachValue=event;
  this.currentPage = 1;
  this.getLoyaltyPoints();
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
  // sorting(sortingBy: string) {
  //   this.isSorting = true;
  //   this.sortingBy = sortingBy;
  //   this.currentOrder = !this.currentOrder;
  //   this.sortingByValue = this.currentOrder ? "asc" : "desc";
  //   this.getLoyaltyPoints();
  // }
  goBack(): void {
    this.location.back();
  }

  
}
