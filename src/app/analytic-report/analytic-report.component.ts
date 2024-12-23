import { Component, OnInit, ViewChild } from "@angular/core";
import * as bootstrap from "bootstrap";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTitleSubtitle,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries
} from "ng-apexcharts";
import { User, stateResponse, Statistics } from "../models";
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type ChartOptions3 = {
  series: number[]; // Donut chart series is an array of numbers
  chart: ApexChart;
  labels: string[]; // Labels correspond to the donut chart's segments
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};
export type ChartOptions4 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
@Component({
  selector: 'analytic-report',
  templateUrl: './analytic-report.component.html',
  styleUrls: ['./analytic-report.component.css']
})
export class AnalyticReportComponent implements OnInit {
  /* users: User[]; */
  dateRangeForm: FormGroup;
  stateData: stateResponse;
  loading = false;
  users: any = [];
  maxDate: string;
  data: any;
  today: string;
  startDate1: Date = null;
  endDate1: Date = null;
  toggleEvent: string = null;
  activeInactiveString: string = null;
  toggleId: any = null;
  statatics: any = {}; // Statistics;
  singleUser: any = {};
  userData: any;
  anauthorised: boolean;
  permissionMenu: any[] = []
  attachmentModelStyle3: string = "";
  attachmentModelCalender: string = "";
  modelStyle: string = "";
  deleteUserId: string = "";
  // @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart2", { static: false }) chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

  @ViewChild("chart3", { static: false }) chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions3>;
  @ViewChild("chart4", { static: false }) chart4: ChartComponent;
  public chartOptions4: Partial<ChartOptions2>;
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private SERVER: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: ["", [Validators.required, this.dateValidator.bind(this)]],
      endDate: ["", [Validators.required, this.dateValidator.bind(this)]]
    });
    this.chartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        
      ],
      chart: {
        type: "bar",
        height: 335,
      },
      title: {
        text: "Bookings"
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "(Number Of Booking)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return + val + " Number Of Booking";
          }
        }
      }
    };
    this.chartOptions2 = {
      series: [
        {
          name: "Customers Added Money To The Wallet",
          data: [30, 40, 50, 60, 71, 80, 90, 60, 66]
        },
        {
          name: "Customers Withdrawal Money From Wallet",
          data: [30, 40, 50, 60, 71, 80, 90, 60, 66]
        },
        {
          name: "Spend Money From the Customers To The Booking",
          data: [30, 40, 50, 60, 71, 80, 90, 60, 66]
        },
        {
          name: "Platform Fee That We Have Charged From The Booking",
          data: [30, 40, 50, 60, 71, 80, 90, 60, 66]
        },
        {
          name: "The Tax We Have To Pay For The Bookings",
          data: [3, 4, 5, 6, 7, 8, 9, 6, 6]
        },
        
      ],
      chart: {
        type: "bar",
        height: 350,

      },
      title: {
        text: "Wallet"
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "65%",
          
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "(Wallet Amount)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return + val + " Peso";
          }
        }
      }
    };
    this.chartOptions3 = {
      series: [20,80], // Series should now be a single array of values
      chart: {
        type: "donut", // Change chart type to donut
        height: 350,
      },
      title: {
        text: "Bikes Data",
      },
      labels: [
        "Booked bikes",
        "Avilables bikes"
      ], // Add labels to correspond to the series
      tooltip: {
        y: {
          formatter: function (val) {
            return + val +''
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%", // Set the size of the donut
          },
          customScale: 1, // Custom scaling for the chart
        },
      },
      legend: {
        position: "bottom", // Optional: adjust legend position for better presentation
      }
    };
    
    this.chartOptions4 = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
       
        
      ],
      chart: {
        type: "bar",
        height: 335,

      },
      title: {
        text: "My First Angular Chart"
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
  ngOnInit() {
    this.userData = localStorage.getItem("currentUser");
    this.userData = JSON.parse(this.userData);
    this.permissionMenu = this.userData?.existingUser?.adminPermission
    if (this.permissionMenu && this.permissionMenu.length > 0) {
      this.anauthorised = this.permissionMenu.includes("user_management")
      if (this.anauthorised) {
        this.getUsers();
      }
    }
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();

    this.maxDate = `${year}-${month}-${day}`;
    this.attachmentModelStyle3 = "none";
    this.attachmentModelCalender = "none";
    this.modelStyle = "none";
    this.getStats();


    // this.data = [];

    this.today = new Date().toISOString().split('T')[0];
  }
  openDateRange() {
    this.attachmentModelCalender = "block";
  }
  getStats() {
    this.spinner.show();
    if (this.startDate1 !== null && this.endDate1 !== null) {
      var payload = {
        fromDate: this.startDate1,
        toDate: this.endDate1
      };
    } else {
      var payload2 = {};
    }
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.dashboardStats,
      payload ? payload : {},
      true,
    ).subscribe((res) => {
      this.statatics = res.data.stats;
      this.spinner.hide();
    });
  }
  attacmentCloseModel3() {
    this.attachmentModelStyle3 = "none";
    this.toggleEvent = '';
    this.toggleId = '';
  }
  attachmentModelCalenderFunction() {
    this.attachmentModelCalender = "none";
  }

  // get startDate() {
  //   return this.dateRangeForm.get('startDate');
  // }

  // get endDate() {
  //   return this.dateRangeForm.get('endDate');
  // }
  get f() {
    return this.dateRangeForm.controls;
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const todayDate = new Date(this.maxDate);

    if (inputDate > todayDate) {
      return { invalidDate: true };
    }
    return null;
  }

  onSubmit() {
    if (this.dateRangeForm.valid) {
      const startDate = new Date(this.dateRangeForm.value.startDate);
      const endDate = new Date(this.dateRangeForm.value.endDate);
      if (startDate > endDate) {
        this.toastr.error("Error!", "Start date should not be greater than end date");
        return
      }
      this.startDate1 = this.dateRangeForm.value.startDate;
      this.endDate1 = this.dateRangeForm.value.endDate;
      this.attachmentModelCalenderFunction()
      this.getStats();
    } else {
      this.dateRangeForm.markAllAsTouched();
    }
  }
  reset() {
    this.dateRangeForm.reset()
    this.startDate1 = null;
    this.endDate1 = null;
    this.getStats();
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
  activeInactiveChange2(event: string, id: any) {
    if (event === 'true') {
      this.activeInactiveString = 'Active';
    } else {
      this.activeInactiveString = 'Inactive';
    }
    this.toggleEvent = event;
    this.toggleId = id;
    this.attachmentModelStyle3 = "block";
  }
  getUsers() {
    this.spinner.show();
    var payload = {
      page: 1,
      pageSize: 10,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getUsers,
      payload,
      true,
    ).subscribe((res) => {
      this.users = res?.data;
      this.spinner.hide();
    });
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
  openDeleteModel(item: any) {
    this.singleUser = item;
    this.modelStyle = "block";
    this.deleteUserId = item.manualUserId;
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
      this.getUsers();
    });
  }
  exportToExcel(): void {
    const columns = ['Registered user', 'New Users', 'Total Merchants', 'Total Businesses', 'Total Merchant Balance', 'Total Business Sales', 'Total amount - Pending LP invoices', 'Total Customer’s wallet balance', 'Total Balance', 'Total Transactions', 'Pending Invoice', 'Cash In', 'Cash Out'];
    const data = [
      {
        'Registered user': this.statatics.registered_users,
        'New Users': this.statatics.new_users,
        'Total Merchants': this.statatics.total_merchants,
        'Total Businesses': this.statatics.total_businesses,
        'Total Merchant Balance': `₱${this.statatics.total_merchant_balance}`,
        'Total Business Sales': `₱${this.statatics.total_business_balance}`,
        'Total amount - Pending LP invoices': `₱${this.statatics.pending_invoices_amount}`,
        'Total Customer’s wallet balance': `₱${this.statatics.total_customer_balance}`,
        'Total Balance': `₱${this.statatics.total_balance}`,
        'Total Transactions': this.statatics.total_tnx,
        'Pending Invoice': this.statatics.pending_invoices,
        'Cash In':`₱${this.statatics.totalCashIn}`,
        'Cash Out':  `₱${this.statatics.totalCashOut}`
      }
    ];
    this.exportToExcel2(columns, data, 'exported_data');
  }
  exportToCsv(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, `${fileName}.csv`);
  }

  exportToPdf(columns: string[], data: any[], fileName: string): void {
    const doc = new jsPDF();
    const rows = data.map(item => columns.map(col => item[col]));
    (doc as any).autoTable({
      head: [columns],
      body: rows
    });
    doc.save(`${fileName}.pdf`);
  }
  exportToExcel2(columns: string[], data: any[], fileName: string): void {
    // Create a worksheet from the data
    const wsData = [columns, ...data.map(item => columns.map(col => item[col]))];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  exportCSV(): void {

    var data = [
      {
        'Registered user': this.statatics.registered_users,
        'New Users': this.statatics.new_users,
        'Total Merchants': this.statatics.total_merchants,
        'Total Businesses': this.statatics.total_businesses,
        'Total Merchant Balance': `₱${this.statatics.total_merchant_balance}`,
        'Total Business Sales': `₱${this.statatics.total_business_balance}`,
        'Total amount - Pending LP invoices': `₱${this.statatics.pending_invoices_amount}`,
        'Total Customer’s wallet balance': `₱${this.statatics.total_customer_balance}`,
        'Total Balance': `₱${this.statatics.total_balance}`,
        'Total Transactions': this.statatics.total_tnx,
        'Pending Invoice': this.statatics.pending_invoices,
        'Cash In':`₱${this.statatics.totalCashIn}`,
        'Cash Out':  `₱${this.statatics.totalCashOut}`
      }
    ];
    this.exportToCsv(data, 'csv');
  }
  exportPDF(): void {
    const columns = ['Registered user', 'New Users', 'Total Merchants', 'Total Balance', 'Total Merchant Balance', 'Total Business Sales', 'Total amount - Pending LP invoices', 'Total Customer’s wallet balance', 'Total Businesses', 'Total Transactions', 'Pending Invoice', 'Cash In', 'Cash Out'];
    var data = [
      {
        'Registered user': this.statatics.registered_users,
        'New Users': this.statatics.new_users,
        'Total Merchants': this.statatics.total_merchants,
        'Total Businesses': this.statatics.total_businesses,
        'Total Merchant Balance': `₱${this.statatics.total_merchant_balance}`,
        'Total Business Sales': `₱${this.statatics.total_business_balance}`,
        'Total amount - Pending LP invoices': `₱${this.statatics.pending_invoices_amount}`,
        'Total Customer’s wallet balance': `₱${this.statatics.total_customer_balance}`,
        'Total Balance': `₱${this.statatics.total_balance}`,
        'Total Transactions': this.statatics.total_tnx,
        'Pending Invoice': this.statatics.pending_invoices,
        'Cash In':`₱${this.statatics.totalCashIn}`,
        'Cash Out':  `₱${this.statatics.totalCashOut}`
      }
    ];
    this.exportToPdf(columns, data, 'data');
  }
}

