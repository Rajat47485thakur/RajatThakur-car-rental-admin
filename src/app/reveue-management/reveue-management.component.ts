import { Component, OnInit,ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};
export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: "reveue-management",
  templateUrl: "./reveue-management.component.html",
  styleUrls: ["./reveue-management.component.css"],
})
export class ReveueManagementComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions2>;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        
      ],
      chart: {
        type: "bar",

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
    this.chartOptions2 = {
      series: [70],
      chart: {
        height: 130,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "45%"
          }
        }
      },
      labels: [""]
    };
    this.chartOptions3 = {
      series: [80],
      chart: {
        height: 110,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%"
          }
          
        }
      },
      labels: [""]
    };
  }

  ngOnInit(): void {}
}
