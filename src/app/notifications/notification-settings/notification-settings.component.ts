import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
declare const $: any;
import { UsersService, AuthenticationService, ApiService } from "../../services";

@Component({
  selector: "notification-settings",
  templateUrl: "./notification-settings.component.html",
  styleUrls: ["./notification-settings.component.css"],
})
export class NotificationSettingsComponent implements OnInit {
  currentPage: any = 1;
  pusher: any = {}
  pusher2: any = {}
  nodificationsList: any[] = [];
  constructor(
    private element: ElementRef,
    private router: Router,
    protected SERVER: ApiService,
    private spinner: NgxSpinnerService,
    public authenticationService: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getNotifications()
  }
  getNotifications() {
    this.spinner.show();
    var payload = {

    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getNotificationSettings, payload,
      true,
    ).subscribe((res) => {
      this.nodificationsList = res.data;
      this.pusher2 = this.nodificationsList
      this.pusher = {
        systemUpdates: this.pusher2.systemUpdates,
        billRemainders: this.pusher2.billRemainders,
        customerSupport: this.pusher2.customerSupport,
        securityAlerts: this.pusher2.securityAlerts,
        feedBackAndSurveys: this.pusher2.feedBackAndSurveys,
        offerRelated: this.pusher2.offerRelated,
        transactionUpdates: this.pusher2.transactionUpdates
    };
      // console.log(this.pusher)
      this.spinner.hide();
    });
  }
  // pushTypeChange(event: any, pusher: string, child: number) {
  //   console.log(event.target.checked)
  //   console.log(pusher)
  //   console.log(child)
  //   const isChecked = event.target.checked;
  //   const pusherMap = {
  //     SYSTEMUPDATE: 'systemUpdates',
  //     BILLREMAINDERS: 'billRemainders',
  //     CUSTOMERSUPPORT: 'customerSupport',
  //     SECURITYALERTS: 'securityAlerts',
  //     FEEDBACKANDSURVEYS: 'feedBackAndSurveys',
  //     OFFERRELATED: 'offerRelated',
  //     TRANSACTIONUPDATE: 'transactionUpdates'
  //   };
  
  //   const mainMap = {
  //     0: ['main', 'serverMaintenance', 'serviceRestored', 'email', 'push'],
  //     1: 'serverMaintenance',
  //     2: 'serviceRestored',
  //     3: 'email',
  //     4: 'push',
  //     5: 'reciepts',
  //     6: 'confirmation',
  //     7: 'declined',
  //     8: 'paymentConfirmation',
  //     9: 'billDues',
  //     10: 'supportTicketUpdate',
  //     11: 'supportAvailability',
  //     12: 'loginAlerts',
  //     13: 'suspeciousActivity',
  //     14: 'feedBackRequest',
  //     15: 'specialOfferDeals',
  //   };
  
  //   if (!pusherMap[pusher]) return;
  //   const pusherObj = this.pusher[pusherMap[pusher]];
  //   console.log(pusherObj);
  //   if (child === 0) {
  //     this.toggleAll(pusherObj, isChecked, mainMap[child]);
  //   } else {
  //     pusherObj[mainMap[child]] = isChecked;
  //     this.checkAllChecked(pusherMap[pusher], mainMap[child]);
  //   }
  //   console.log(this.pusher);
  // }
  
  // toggleAll(pusherObj, isChecked, keys) {
  //   keys.forEach(key => pusherObj[key] = isChecked);
  // }
  
  // checkAllChecked(pusherType, key) {
  //   const allChecked = {
  //     systemUpdates: ['serverMaintenance', 'serviceRestored', 'email', 'push'],
  //     billRemainders: ['billDues', 'paymentConfirmation', 'email', 'push'],
  //     customerSupport: ['supportTicketUpdate', 'supportAvailability', 'email', 'push'],
  //     securityAlerts: ['loginAlerts', 'suspeciousActivity', 'email', 'push'],
  //     feedBackAndSurveys: ['feedBackRequest', 'email', 'push'],
  //     offerRelated: ['specialOfferDeals', 'email', 'push'],
  //     transactionUpdates: ['confirmation', 'declined', 'reciepts', 'email', 'push'],
  //   };
  
  //   const pusherObj = this.pusher[pusherType];
  //   const keys = allChecked[pusherType];
    
  //   pusherObj.main = keys.every(key => pusherObj[key]);
  // }  
  pushTypeChange(event: any, pusher: string, child: number) {
    // console.log(event.target.checked)
    // console.log(pusher)
    // console.log(child)
    const isChecked = event.target.checked;
    if (pusher == 'SYSTEMUPDATE' && child === 0) {
      if (isChecked) {
        this.pusher.systemUpdates.serverMaintenance = true;
        this.pusher.systemUpdates.serviceRestored = true;
        this.pusher.systemUpdates.email = true;
        this.pusher.systemUpdates.push = true;
        this.pusher.systemUpdates.main = true;
      }
      else {
        this.pusher.systemUpdates.serverMaintenance = false;
        this.pusher.systemUpdates.serviceRestored = false;
        this.pusher.systemUpdates.email = false;
        this.pusher.systemUpdates.push = false;
        this.pusher.systemUpdates.main = false;
      }
    }
    else if (pusher == 'SYSTEMUPDATE' && child === 1) {
      this.pusher.systemUpdates.serverMaintenance = isChecked;
      this.checkAllChecked('SYSTEMUPDATE');
    }
    else if (pusher == 'SYSTEMUPDATE' && child === 2) {
      this.pusher.systemUpdates.serviceRestored = isChecked;
      this.checkAllChecked('SYSTEMUPDATE');
    }
    else if (pusher == 'SYSTEMUPDATE' && child === 3) {
      this.pusher.systemUpdates.email = isChecked;
      this.checkAllChecked('SYSTEMUPDATE');
    }
    else if (pusher == 'SYSTEMUPDATE' && child === 4) {
      this.pusher.systemUpdates.push = isChecked;
      this.checkAllChecked('SYSTEMUPDATE');
    }
    else if (pusher == 'BILLREMAINDERS' && child === 0) {
      if (isChecked) {
        this.pusher.billRemainders.main = true;
        this.pusher.billRemainders.billDues = true;
        this.pusher.billRemainders.paymentConfirmation = true;
        this.pusher.billRemainders.email = true;
        this.pusher.billRemainders.push = true;
      }
      else {
        this.pusher.billRemainders.main = false;
        this.pusher.billRemainders.billDues = false;
        this.pusher.billRemainders.paymentConfirmation = false;
        this.pusher.billRemainders.email = false;
        this.pusher.billRemainders.push = false;
      }
    }
    else if (pusher == 'BILLREMAINDERS' && child === 9) {
      this.pusher.billRemainders.billDues = isChecked;
      this.checkAllChecked('BILLREMAINDERS');
    }
    else if (pusher == 'BILLREMAINDERS' && child === 8) {
      this.pusher.billRemainders.paymentConfirmation = isChecked;
      this.checkAllChecked('BILLREMAINDERS');
    }
    else if (pusher == 'BILLREMAINDERS' && child === 3) {
      this.pusher.billRemainders.email = isChecked;
      this.checkAllChecked('BILLREMAINDERS');
    }
    else if (pusher == 'BILLREMAINDERS' && child === 4) {
      this.pusher.billRemainders.push = isChecked;
      this.checkAllChecked('BILLREMAINDERS');
    }
    else if (pusher == 'CUSTOMERSUPPORT' && child === 0) {
      if (isChecked) {
        this.pusher.customerSupport.main = true;
        this.pusher.customerSupport.supportTicketUpdate = true;
        this.pusher.customerSupport.supportAvailability = true;
        this.pusher.customerSupport.email = true;
        this.pusher.customerSupport.push = true;
      }
      else {
        this.pusher.customerSupport.main = false;
        this.pusher.customerSupport.supportTicketUpdate = false;
        this.pusher.customerSupport.supportAvailability = false;
        this.pusher.customerSupport.email = false;
        this.pusher.customerSupport.push = false;
      }
    }
    else if (pusher == 'CUSTOMERSUPPORT' && child === 10) {
      this.pusher.customerSupport.supportTicketUpdate = isChecked;
      this.checkAllChecked('CUSTOMERSUPPORT');
    }
    else if (pusher == 'CUSTOMERSUPPORT' && child === 11) {
      this.pusher.customerSupport.supportAvailability = isChecked;
      this.checkAllChecked('CUSTOMERSUPPORT');
    }
    else if (pusher == 'CUSTOMERSUPPORT' && child === 3) {
      this.pusher.customerSupport.email = isChecked;
      this.checkAllChecked('CUSTOMERSUPPORT');
    }
    else if (pusher == 'CUSTOMERSUPPORT' && child === 4) {
      this.pusher.customerSupport.push = isChecked;
      this.checkAllChecked('CUSTOMERSUPPORT');
    }
    else if (pusher == 'SECURITYALERTS' && child === 0) {
      if (isChecked) {
        this.pusher.securityAlerts.main = true;
        this.pusher.securityAlerts.loginAlerts = true;
        this.pusher.securityAlerts.suspeciousActivity = true;
        this.pusher.securityAlerts.email = true;
        this.pusher.securityAlerts.push = true;
      }
      else {
        this.pusher.securityAlerts.main = false;
        this.pusher.securityAlerts.loginAlerts = false;
        this.pusher.securityAlerts.suspeciousActivity = false;
        this.pusher.securityAlerts.email = false;
        this.pusher.securityAlerts.push = false;
      }
    }
    else if (pusher == 'SECURITYALERTS' && child === 12) {
      this.pusher.securityAlerts.loginAlerts = isChecked;
      this.checkAllChecked('SECURITYALERTS');
    }
    else if (pusher == 'SECURITYALERTS' && child === 13) {
      this.pusher.securityAlerts.suspeciousActivity = isChecked;
      this.checkAllChecked('SECURITYALERTS');
    }
    else if (pusher == 'SECURITYALERTS' && child === 3) {
      this.pusher.securityAlerts.email = isChecked;
      this.checkAllChecked('SECURITYALERTS');
    }
    else if (pusher == 'SECURITYALERTS' && child === 4) {
      this.pusher.securityAlerts.push = isChecked;
      this.checkAllChecked('SECURITYALERTS');
    }
    else if (pusher == 'FEEDBACKANDSURVEYS' && child === 0) {
      if (isChecked) {
        this.pusher.feedBackAndSurveys.main = true;
        this.pusher.feedBackAndSurveys.feedBackRequest = true;
        this.pusher.feedBackAndSurveys.email = true;
        this.pusher.feedBackAndSurveys.push = true;
      }
      else {
        this.pusher.feedBackAndSurveys.main = false;
        this.pusher.feedBackAndSurveys.feedBackRequest = false;
        this.pusher.feedBackAndSurveys.email = false;
        this.pusher.feedBackAndSurveys.push = false;
      }
    }
    else if (pusher == 'FEEDBACKANDSURVEYS' && child === 14) {
      this.pusher.feedBackAndSurveys.feedBackRequest = isChecked;
      this.checkAllChecked('FEEDBACKANDSURVEYS');
    }

    else if (pusher == 'FEEDBACKANDSURVEYS' && child === 3) {
      this.pusher.feedBackAndSurveys.email = isChecked;
      this.checkAllChecked('FEEDBACKANDSURVEYS');
    }
    else if (pusher == 'FEEDBACKANDSURVEYS' && child === 4) {
      this.pusher.feedBackAndSurveys.push = isChecked;
      this.checkAllChecked('FEEDBACKANDSURVEYS');
    }

    else if (pusher == 'OFFERRELATED' && child === 0) {
      if (isChecked) {
        this.pusher.offerRelated.main = true;
        this.pusher.offerRelated.specialOfferDeals = true;
        this.pusher.offerRelated.email = true;
        this.pusher.offerRelated.push = true;
      }
      else {
        this.pusher.offerRelated.main = false;
        this.pusher.offerRelated.specialOfferDeals = false;
        this.pusher.offerRelated.email = false;
        this.pusher.offerRelated.push = false;
      }
    }
    else if (pusher == 'OFFERRELATED' && child === 15) {
      this.pusher.offerRelated.specialOfferDeals = isChecked;
      this.checkAllChecked('OFFERRELATED');
    }

    else if (pusher == 'OFFERRELATED' && child === 3) {
      this.pusher.offerRelated.email = isChecked;
      this.checkAllChecked('OFFERRELATED');
    }
    else if (pusher == 'OFFERRELATED' && child === 4) {
      this.pusher.offerRelated.push = isChecked;
      this.checkAllChecked('OFFERRELATED');
    }
    else if (pusher == 'TRANSACTIONUPDATE' && child === 0) {
      if (isChecked) {
        this.pusher.transactionUpdates.main = true;
        this.pusher.transactionUpdates.confirmation = true;
        this.pusher.transactionUpdates.declined = true;
        this.pusher.transactionUpdates.reciepts = true;
        this.pusher.transactionUpdates.email = true;
        this.pusher.transactionUpdates.push = true;
      }
      else {
        this.pusher.transactionUpdates.main = false;
        this.pusher.transactionUpdates.confirmation = false;
        this.pusher.transactionUpdates.declined = false;
        this.pusher.transactionUpdates.reciepts = false;
        this.pusher.transactionUpdates.email = false;
        this.pusher.transactionUpdates.push = false;
      }
    }
    else if (pusher == 'TRANSACTIONUPDATE' && child === 6) {
      this.pusher.transactionUpdates.confirmation = isChecked;
      this.checkAllChecked('TRANSACTIONUPDATE');
    }

    else if (pusher == 'TRANSACTIONUPDATE' && child === 7) {
      this.pusher.transactionUpdates.declined = isChecked;
      this.checkAllChecked('TRANSACTIONUPDATE');
    }
    else if (pusher == 'TRANSACTIONUPDATE' && child === 5) {
      this.pusher.transactionUpdates.reciepts = isChecked;
      this.checkAllChecked('TRANSACTIONUPDATE');
    }
    else if (pusher == 'TRANSACTIONUPDATE' && child === 3) {
      this.pusher.transactionUpdates.email = isChecked;
      this.checkAllChecked('TRANSACTIONUPDATE');
    }
    else if (pusher == 'TRANSACTIONUPDATE' && child === 4) {
      this.pusher.transactionUpdates.push = isChecked;
      this.checkAllChecked('TRANSACTIONUPDATE');
    }
   
    // console.log(this.pusher)
  }
  checkAllChecked(data: string) {
    if (data === "SYSTEMUPDATE") {
      if (this.pusher.systemUpdates.serverMaintenance &&
        this.pusher.systemUpdates.serviceRestored &&
        this.pusher.systemUpdates.email &&
        this.pusher.systemUpdates.push
      ) {
        this.pusher.systemUpdates.main = true;
      }
      else {
        this.pusher.systemUpdates.main = false;
      }
    } else if (data === "BILLREMAINDERS") {
      if (
        this.pusher.billRemainders.billDues &&
        this.pusher.billRemainders.paymentConfirmation &&
        this.pusher.billRemainders.email  &&
        this.pusher.billRemainders.push
      ) {
        this.pusher.billRemainders.main = true;
      }
      else {
        this.pusher.billRemainders.main = false;
      }
    }
    else if (data === "CUSTOMERSUPPORT") {
      if (
        this.pusher.customerSupport.supportTicketUpdate &&
        this.pusher.customerSupport.supportAvailability &&
        this.pusher.customerSupport.email &&
        this.pusher.customerSupport.push
      ) {
        this.pusher.customerSupport.main = true;
      }
      else {
        this.pusher.customerSupport.main = false;
      }
    }
    else if (data === "SECURITYALERTS") {
      if (
        this.pusher.securityAlerts.loginAlerts &&
        this.pusher.securityAlerts.suspeciousActivity &&
        this.pusher.securityAlerts.email &&
        this.pusher.securityAlerts.push
      ) {
        this.pusher.securityAlerts.main = true;
      }
      else {
        this.pusher.securityAlerts.main = false;
      }
    }
    else if (data === "FEEDBACKANDSURVEYS") {
      if (
        this.pusher.feedBackAndSurveys.feedBackRequest &&
        this.pusher.feedBackAndSurveys.email &&
        this.pusher.feedBackAndSurveys.push
      ) {
        this.pusher.feedBackAndSurveys.main = true;
      }
      else {
        this.pusher.feedBackAndSurveys.main = false;
      }
    }
    else if (data === "OFFERRELATED") {
      if (
        this.pusher.offerRelated.specialOfferDeals &&
        this.pusher.offerRelated.email &&
        this.pusher.offerRelated.push
      ) {
        this.pusher.offerRelated.main = true;
      }
      else {
        this.pusher.offerRelated.main = false;
      }
    }
    else if (data === "TRANSACTIONUPDATE") {
      if (
        this.pusher.transactionUpdates.confirmation &&
        this.pusher.transactionUpdates.declined &&
        this.pusher.transactionUpdates.reciepts &&
        this.pusher.transactionUpdates.email &&
        this.pusher.transactionUpdates.push
      ) {
        this.pusher.transactionUpdates.main = true;
      }
      else {
        this.pusher.transactionUpdates.main = false;
      }
    }
  }
  showPusher()
  {
    // console.log(this.pusher)
    var payload = {
      data:this.pusher
    };
    this.SERVER.APPROVED_DOCUMENT(
      this.SERVER.END_POINT.updateNotificationSettings,
      payload,
    ).subscribe((res) => {
      if(res.status===200)
        {
          this. getNotifications();
          this.toastr.success("Success!", res.message);
        }
    });
  }
}
