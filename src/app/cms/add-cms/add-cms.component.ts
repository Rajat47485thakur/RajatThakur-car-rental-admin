import { Component, OnInit } from "@angular/core";
import { Editor,Toolbar } from 'ngx-editor';
import { Location } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
@Component({
  selector: "add-cms",
  templateUrl: "./add-cms.component.html",
  styleUrls: ["./add-cms.component.css"],
})
export class AddCmsComponent implements OnInit {
  createForm: FormGroup;
  updateFormValue: boolean = false;
  submitted = false;
  previewHtml:any
  typeData:any=null;
  attachmentModelStyle4: string = "";
  editData:any;
  user_id: string = "";
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private userService: UsersService,
    private _Activatedroute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    protected SERVER: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    if(this._Activatedroute.snapshot.params["id"])
      {
        this.user_id = this._Activatedroute.snapshot.params["id"];
        this.getCmsById()
        this.updateFormValue=true
      }
      else{
        this.updateFormValue=false
      }
    
  }
  editor: Editor;
  html = '';
/*   editordoc = jsonDoc; */

/*   editor: Editor; */
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  ngOnInit(): void {
    this.attachmentModelStyle4= "none";
    this.editor = new Editor();
    this.createForm = this.formBuilder.group({
      pageTitle: ['', Validators.required],
      pageSubTitle: [''],
      type: [null, Validators.required],
      description:['',Validators.required]
    });
  }
  goBack(): void {
    this.location.back();
  }
  getTrustedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  showPreview() {
    this.previewHtml=this.createForm.value.description
  this.attachmentModelStyle4='block'
  }
  submitForm() {
    if (this.createForm.invalid) {
      this.submitted = true;
      return;
    }

    if (!this.updateFormValue) {
     
      var payload = {
        "title": this.createForm.value.pageTitle,
        "subTitle": this.createForm.value.pageSubTitle,
        "description": this.createForm.value.description,
        // "image": "pppppp.png",
        "type": +(this.createForm.value.type)
    }
      this.SERVER.POST_DATA2(
        this.SERVER.END_POINT.addCMS,
        payload,
      ).subscribe((res) => {
        this.createForm.reset();
        this.toastr.success("Success!", res.message);
        this.router.navigate(["/cms"]);
        // this.getBusinesses();
      });
    } else if (this.updateFormValue) {
      var payload2 = {
        '_id': this.editData?._id,
        "title": this.createForm.value.pageTitle,
        "subTitle": this.createForm.value.pageSubTitle,
        "description": this.createForm.value.description,
        // "image": "pppppp.png",
        "type": +(this.createForm.value.type)
      };
      this.SERVER.REJECT_DOCUMENT(
        this.SERVER.END_POINT.updateCMS,
        payload2,
      ).subscribe((res) => {
        this.createForm.reset();
        this.toastr.success("Success!", res.message);
        this.router.navigate(["/cms"]);
      });
    }
  }
  getCmsById() {
    var payload = {
      _id: this.user_id
    };
    this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getCMSBYId,
      payload,
      true,
    ).subscribe((res) => {
      this.editData=res.data
      this.createForm.patchValue({
        pageTitle: this.editData?.title,
        pageSubTitle: this.editData?.subTitle,
        type: this.editData?.type,
        description:this.editData?.description
      });
      // this.users = res.data;
      this.spinner.hide()
      // this.totalPage = Math.ceil(this.users.userCount / 10);
     ;
    }),(error) => {
      console.error('Error:', error);
      this.spinner.hide()
    };
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  attacmentCloseModel4() {
    this.attachmentModelStyle4 = "none";
  }
}
