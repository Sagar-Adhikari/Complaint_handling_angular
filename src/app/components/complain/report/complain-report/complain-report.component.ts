import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout.service';
import { FormControl } from '@angular/forms';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-complain-report',
  templateUrl: './complain-report.component.html',
  styleUrls: ['./complain-report.component.scss']
})
export class ComplainReportComponent implements OnInit {
  maxDate = new Date();
  minDate = new Date();
  fromDate = new FormControl();
  toDate = new FormControl();

  chartList = [
    { id: 1, name: 'category' },
    { id: 2, name: 'service provider' },
    { id: 3, name: 'pending complain' },
    { id: 4, name: 'pending complain from forwarded' },
    { id: 5, name: 'resolved complain' },
  ];

  chartId: number = 1;
  flag: number = 1;

  loading = false;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };


  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;


  public barChartData: any[] = [
    { data: [], label: '' },
  ];

  constructor(
    private reportService: ReportService,
    private layoutService: LayoutService
  ) {

    this.layoutService.setLayout({ pageTitle: 'Complain Chart Reports', allowFooter: false });
    this.layoutService.setLoading(false);
  }

  ngOnInit() {
  }

  dateChanged(event) {
    this.minDate = event.value;
    this.toDate = new FormControl(this.minDate);

    this.chartTypeChanged(this.flag);
  }

  chartTypeChanged(flag) {

    if (this.fromDate.value && this.toDate.value) {
      this.layoutService.setLoading(true);
      this.flag = flag;
      this.loading = true;
      this.barChartData = [{ data: [], label: 'Category' }];
      const data = [];
      const label = [];
      if (flag === 1) {
        this.reportService.getCategory(this.fromDate.value, this.toDate.value).subscribe((x: any) => {

          data.push({ data: x.data.count, label: x.data.categoryName });
          const categoryData = [];
          for (let i = 0; i < x.data.length; i++) {
            label.push(x.data[i].categoryName);
            categoryData.push(x.data[i].count);
          }
          this.barChartData = [
            { data: categoryData, label: 'Category' },
          ];
          this.barChartLabels = label;
          this.loading = false;
          this.layoutService.setLoading(false);
        });
      }
      else if (flag === 2) {
        this.reportService.getServiceProvider(this.fromDate.value, this.toDate.value).subscribe((x: any) => {
          data.push({ data: x.data.count, label: x.data.serviceProviderName });
          const serviceProviderData = [];
          for (let i = 0; i < x.data.length; i++) {
            label.push(x.data[i].serviceProviderName);
            serviceProviderData.push(x.data[i].count);
          }
          this.barChartData = [
            { data: serviceProviderData, label: 'Service Provider' },
          ];
          this.barChartLabels = label;
          this.layoutService.setLoading(false);
          this.loading = false;
        });
      } else if (flag === 3) {
        this.reportService.getPendingComplain().subscribe((x: any) => {
          data.push({ data: x.data.count, label: x.data.serviceProviderName });
          const pendingServiceProviderData = [];
          for (let i = 0; i < x.data.length; i++) {
            label.push(x.data[i].serviceProviderName);
            pendingServiceProviderData.push(x.data[i].count);
          }
          this.barChartData = [
            { data: pendingServiceProviderData, label: 'Pending Complain' },
          ];
          this.barChartLabels = label;
          this.layoutService.setLoading(false);
          this.loading = false;
        });

      } else if (flag === 4) {
        this.reportService.getPendingComplainFromForwarded().subscribe((x: any) => {
          data.push({ data: x.data.count, label: x.data.serviceProviderName });
          const pendingFromForwardedData = [];
          for (let i = 0; i < x.data.length; i++) {
            label.push(x.data[i].serviceProviderName);
            pendingFromForwardedData.push(x.data[i].count);
          }
          this.barChartData = [
            { data: pendingFromForwardedData, label: 'Pending Complain From Forwarded' },
          ];
          this.barChartLabels = label;
          this.layoutService.setLoading(false);
          this.loading = false;
        });

      } else if (flag === 5) {
        this.reportService.getResolvedComplain(this.fromDate.value, this.toDate.value).subscribe((x: any) => {
          data.push({ data: x.data.count, label: x.data.serviceProviderName });
          const resolvedComplainData = [];
          for (let i = 0; i < x.data.length; i++) {
            label.push(x.data[i].serviceProviderName);
            resolvedComplainData.push(x.data[i].count);
          }
          this.barChartData = [
            { data: resolvedComplainData, label: 'Resolved Complain' },
          ];
          this.barChartLabels = label;
          this.layoutService.setLoading(false);
          this.loading = false;
        });
      }
    }
  }
}
