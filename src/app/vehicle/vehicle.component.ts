
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { DatePipe, Location } from "@angular/common";
declare var $: any;
import { Component, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { interval } from 'rxjs';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService, AuthenticationService, ApiService } from "../services";
import { MustMatch } from "../helpers";


@Component({
  selector: 'vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  @ViewChild('searchInput2') searchInput2: ElementRef;
  @ViewChild('searchInput3') searchInput3: ElementRef;
  placeholderTexts: string[] = [
    "'Brand Name'",
  ];
  attachmentModelStyle: string = "";
  attachmentModelStyle2: string = "";
  placeholderText: string;
  brandFrom: FormGroup;
  modalFrom: FormGroup;
  isShowCross: boolean = false;
  currentIndex = 0;
  searchInput: Subject<string> = new Subject<string>();
  searchSubscription: Subscription | undefined;
  placeholderTexts5: string[] = [
    "'Model Name'",
  ];
  placeholderText5: string;
  categoryName: string = null;
  isShowCross5: boolean = false;
  currentIndex5 = 0;
  searchInput5: Subject<string> = new Subject<string>();
  searchSubscription5: Subscription | undefined;
  statusType: string = "ALL";
  currentPage: any = 1;
  imageUrl2: any;
  currentPage2: any = 1;
  isFirstTabActive = true;
  submitted = false;
  roles: any = [];
  // searchShow:string=
  toggleEvent: string = null;
  activeInactiveString: string = null;
  toggleId: any = null;
  activeTab: string = 'home';
  isApproved: any = null
  myForm: FormGroup;
  totalPage: any = 0;
  totalPage2: any = 0;
  seachValue: string = "";
  transactionId: string = '';
  logoUrl: any;
  updateCategory: boolean = false
  businessLogo: any;
  seachValue2: string = "";
  sortingBy: number = -1;
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  attachmentModelStyle3: string = "";
  addUser: FormGroup;
  brand: any = [];
  brandname: any = [];
  modal: any = []
  updateUser: any = {};
  brandImg: any = [];
  action: any;
  brandId!: string;
  deleteId: any;
  deleteName: any;
  editId: any;
  brandDetails: any;
  modelDetails: any;

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {
    this.placeholderText = this.placeholderTexts[0];
    interval(1000).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.placeholderTexts.length;
      this.placeholderText = this.placeholderTexts[this.currentIndex];
    });
    this.placeholderText5 = this.placeholderTexts5[0];
    interval(1000).subscribe(() => {
      this.currentIndex5 = (this.currentIndex5 + 1) % this.placeholderTexts5.length;
      this.placeholderText5 = this.placeholderTexts5[this.currentIndex5];
    });
    this.searchSubscription = this.searchInput.pipe(
      debounceTime(500), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe((searchValue) => {
      // Call your search function here with the latest search value
      if (searchValue.length >= 1) {
        this.isShowCross = true
      } else {
        this.isShowCross = false
      }
      this.search(searchValue);
      this.search2(searchValue);
    });
    this.searchSubscription5 = this.searchInput5.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((searchValue) => {
      if (searchValue.length >= 1) {
        this.isShowCross5 = true
      } else {
        this.isShowCross5 = false
      }
      this.search2(searchValue);
    });
  }

  ngOnInit(): void {
    this.attachmentModelStyle = "none";
    this.attachmentModelStyle2 = "none";
    this.attachmentModelStyle3 = "none";

    this.brandFrom = this.formBuilder.group({
      name: ['', [Validators.required]],
      images: [[]]

    })

    this.modalFrom = this.formBuilder.group({
      brandId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      images: ['']

    })

    this.fetchBrandList();
  }


  goBack(): void {
    this.location.back();
  }

  get name() {
    return this.brandFrom.get('name');
  }
  openBrandModal(id: any, action: any) {
    this.editId = id;
    if (this.editId) {
      this.fetchBrandById();
    }
    this.action = action;
    this.brandFrom.reset()
    this.categoryName = '';
    this.updateCategory = false;
    this.imageUrl2 = null;
    this.attachmentModelStyle = "block";
  }
  openAddModal(id: any, action: any) {
    this.editId = id;
    if (this.editId) {
      this.fetchModelById();
    }
    this.action = action;
    this.modalFrom.reset()
    this.categoryName = '';
    this.updateCategory = false;
    this.imageUrl2 = null;
    this.attachmentModelStyle2 = "block";
  }

  openDelete(id: string, name: string) {
    this.attachmentModelStyle3 = "block";
    this.deleteId = id;
    this.deleteName = name;
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent = '';
    this.toggleId = '';
    this.deleteId = '';
  }

  deleteBrand(id: string): void {
    if (!id) {
      console.error('Brand ID is required to delete.');
      return;
    }
    const payload = { _id: id };
    if (this.activeTab === 'home') {

      this.spinner.show();
      this.SERVER.DELETE2(this.SERVER.END_POINT.deleteBrand, payload)
        .subscribe({
          next: (response) => {
            this.attacmentCloseModel3();
            this.fetchBrandList();
          },
          error: (err) => {
            console.error("Error deleting brand:", err);
          },
          complete: () => {
            this.spinner.hide();
          }
        });
    } else {
      this.spinner.show();
      this.SERVER.DELETE2(this.SERVER.END_POINT.deleteModel, payload)
        .subscribe({
          next: (response) => {
            this.attacmentCloseModel3();
            this.fetchModalList();
          },
          error: (err) => {
            console.error("Error deleting brand:", err);
          },
          complete: () => {
            this.spinner.hide();
          }
        });
    }
  }

  statusChange(id: any): void {
    if (!id) {
      console.error('Brand ID is required to delete.');
      return;
    }
    const payload = { _id: id };
    if (this.activeTab === 'home') {

      this.spinner.show();
      this.SERVER.DELETE2(this.SERVER.END_POINT.changeBrandStatus, payload)
        .subscribe({
          next: (response) => {
            this.attacmentCloseModel3();
            this.fetchBrandList();
          },
          error: (err) => {
            console.error("Error deleting brand:", err);
          },
          complete: () => {
            this.spinner.hide();
          }
        });
    } else {
      this.spinner.show();
      this.SERVER.DELETE2(this.SERVER.END_POINT.changeModelStatus, payload)
        .subscribe({
          next: (response) => {
            this.attacmentCloseModel3();
            this.fetchModalList();
          },
          error: (err) => {
            console.error("Error deleting brand:", err);
          },
          complete: () => {
            this.spinner.hide();
          }
        });
    }
  }

  onSubmit() {
    if (this.action !== 'edit') {
      if (this.activeTab === 'home') {
        const payload = {
          name: this.brandFrom?.value?.name,
          images: Array.isArray(this.brandImg) ? this.brandImg : [this.brandImg]
        };
        if (this.brandFrom.valid) {
          this.SERVER.POST_DATA2(
            this.SERVER.END_POINT.addBrand,
            payload,
          ).subscribe((res) => {
            this.toastr.success("Success!", res.message);
            this.attachmentModelStyle = "none"
            this.fetchBrandList();
          });
        }
        if (this.brandFrom.invalid) {
          return;
        }
      }
      else {
        const payload = {
          brandId: this.brandId,
          name: this.modalFrom?.value?.name,
          images: Array.isArray(this.brandImg) ? this.brandImg : [this.brandImg]
        };
        if (this.modalFrom.valid) {
          this.SERVER.POST_DATA2(
            this.SERVER.END_POINT.addModel,
            payload,
          ).subscribe((res) => {
            this.toastr.success("Success!", res.message);
            this.attachmentModelStyle2 = "none"
            this.fetchModalList();
          });
        }
        if (this.brandFrom.invalid) {
          return;
        }
      }
    } else if (this.action === 'edit') {

      if (this.activeTab === 'home') {
        const payload = {
          _id: this.editId,
          name: this.brandFrom?.value?.name,
          images: Array.isArray(this.imageUrl2) ? this.imageUrl2 : [this.imageUrl2]
        };
        if (this.brandFrom.valid) {
          this.SERVER.UPDATE2(
            this.SERVER.END_POINT.editBrand,
            payload,
          ).subscribe((res) => {
            this.toastr.success("Success!", res.message);
            this.attachmentModelStyle = "none"
            this.fetchBrandList();
          });
        }
        if (this.brandFrom.invalid) {
          return;
        }
      }
      else {
        const payload = {
          _id: this.editId,
          brandId: this.brandId,
          name: this.modalFrom?.value?.name,
          images: Array.isArray(this.imageUrl2) ? this.imageUrl2 : [this.imageUrl2]
        };
        if (this.modalFrom.valid) {
          this.SERVER.UPDATE2(
            this.SERVER.END_POINT.editModel,
            payload,
          ).subscribe((res) => {
            this.toastr.success("Success!", res.message);
            this.attachmentModelStyle2 = "none"
            this.fetchModalList();
          });
        }
        if (this.brandFrom.invalid) {
          return;
        }
      }
    }
  }

  fetchBrandList() {
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
    this.spinner.show();
    this.SERVER.GET_VEHICLE_LIST(
      this.SERVER.END_POINT.brandList,
      payload,
    ).subscribe((res) => {
      this.brand = res.data.list;
      this.brandname = res.data.list.map((item: any) => ({
        name: item.name,
        _id: item._id
      }));
      this.totalPage = Math.ceil(res.data.totalCount / 10);
      this.spinner.hide();
    });
  }

  fetchBrandById(): void {
    const params = {
      id: this.editId
    }
    this.spinner.show();
    this.SERVER.GET_VEHICLE_LIST(
      this.SERVER.END_POINT.getBrandById,
      params,
    ).subscribe((res) => {
      this.brandDetails = res?.data
      this.imageUrl2 = this.brandDetails.images[0];

      this.spinner.hide();
      this.cdr.detectChanges();
      this.brandFrom.patchValue({
        name: this.brandDetails.name,
        // images: this.brandDetails.images[0],
      });

    });
  }

  fetchModalList() {
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isApproved) {
      if (this.isApproved == 1) {
        payload["isApproved"] = 'false';
      }
      else if (this.isApproved == 2) {
        payload["isApproved"] = 'true';
      }

    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortByOrder"] = this.sortingByValue;
    }
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.modelList,
      payload,
      true,
    ).subscribe((res) => {

      this.modal = res.data.list;
      this.totalPage2 = Math.ceil(res.data.totalCount / 10);
      this.spinner.hide();
    });
  }

  fetchModelById(): void {
    const params = {
      id: this.editId

    }
    this.spinner.show();
    this.SERVER.GET_VEHICLE_LIST(
      this.SERVER.END_POINT.getModelById,
      params,
    ).subscribe((res) => {
      this.modelDetails = res?.data

      this.imageUrl2 = this.modelDetails.images;
      const brandName = this.brand.find((b: any) => b._id === this.modelDetails.brandId)?.name;
      this.spinner.hide();
      this.modalFrom.patchValue({
        brandId: brandName,
        name: this.modelDetails.name,
        images: this.modelDetails.images,
      });
    });
  }

  onBrandSelect(selectedBrand: any): void {
    if (selectedBrand) {
      const selected = this.brand.find((b: any) => b.name === selectedBrand.name);
      if (selected) {
        this.modalFrom.patchValue({
          brandId: selected.name,
        });
        this.brandId = selected._id;
      }
    }
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

        this.imageUrl2 = res.data.location;
        this.brandImg = res.data.location;

      });
    }
  }



  // Function to convert URL to File object
  private async convertUrlToFile(url: string): Promise<File> {
    const response = await fetch(url); // Fetch the file from the URL
    const blob = await response.blob(); // Convert response to Blob
    const fileName = url.split('/').pop() || 'uploaded_file'; // Extract file name from URL

    return new File([blob], fileName, { type: blob.type }); // Return a File object
  }
  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    // Apply functionality based on the active tab
    if (tabId === 'home') {
      this.seachValue = ''
      this.fetchBrandList()
    } else if (tabId === 'menu2') {
      this.seachValue2 = ''
      this.fetchModalList()
    }
  }

  attacmentCloseModel() {
    this.attachmentModelStyle = "none";
    this.attachmentModelStyle2 = "none";
    this.categoryName = ''
  }
  onOptionChange(value) {

    if (value == 1 || value == 2) {
      this.currentPage2 = 1
      this.isApproved = value;
      this.fetchModalList();
    } else {
      this.isApproved = null;
      this.fetchModalList();
    }
  }
  onOptionChange2(value) {
    this.sortingBy = Number(value);
    this.fetchBrandList()
  }
  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.fetchBrandList();
  }
  paginationAndSorting2(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage2 = this.currentPage2 + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage2 = this.currentPage2 - 1;
    }

    this.fetchModalList();
  }
  //   seach(event: any) {
  //     this.seachValue = event.target.value.trim();
  //     if (this.seachValue.length > 3 || this.seachValue === "") {
  //         // Extract last 10 digits if the search value contains a "+"
  //         if (this.seachValue.includes('+')) {
  //             this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
  //         }

  //         this.currentPage = 1;
  //         this.fetchBrandList();
  //     }
  // }
  search(event: string) {
    // Implement your search logic here
    this.seachValue = event;
    this.currentPage = 1;
    this.fetchBrandList();
  }
  search2(event: string) {
    // Implement your search logic here
    this.seachValue = event;
    this.currentPage = 1;
    this.fetchModalList();
  }
  onSearchChange(event: any, seachNumber: string) {
    if (seachNumber === '1') {
      this.searchInput.next(event.target.value);
    }
    else if (seachNumber === '2') {
      this.searchInput5.next(event.target.value);
    }
    // Push the latest search value into the searchInput Subject
  }
  closeSearch(seachNumber: string) {
    if (seachNumber === '1') {
      this.searchInput.next('')
      this.searchInput2.nativeElement.value = '';
    }
    else if (seachNumber === '2') {
      this.searchInput5.next('')
      this.searchInput3.nativeElement.value = '';
    }

  }
  // seach2(event: any) {
  //   this.seachValue2 = event.target.value.trim();
  //   if (this.seachValue2.length > 3 || this.seachValue2 === "") {
  //       // Extract last 10 digits if the search value contains a "+"
  //       if (this.seachValue2.includes('+')) {
  //           this.seachValue2 = this.seachValue2.substr(this.seachValue2.length - 10);
  //       }

  //       this.currentPage2 = 1;
  //       this.fetchModalList();
  //   }
  // }
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

  /**
   * Brand Routing to Details
   */
  getMerchandById2(_id: any): void {
    // this.router.navigate(['/vehicle-settings/vehicle_details'], {
    //   queryParams: { _id: _id }
    // });
  }
}


