import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout.service';
import { ReportService } from '../report.service';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MonthlyReportComponent implements OnInit {
  dateInput = new FormControl(moment());


  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [], label: 'Monthly Complain' },
  ];

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateInput.value;
    ctrlValue.year(normalizedYear.year());
    this.dateChanged(normalizedYear, "year");
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    this.dateChanged(normalizedMonth, "month");
  }

  dateChanged(date: Moment, handleFrom: string) {
    const ctrlValue = this.dateInput.value;

    if (handleFrom === "month") {
      ctrlValue.month(date.month());
      this.dateInput.setValue(ctrlValue);
      const year = this.dateInput.value._d.getFullYear();
      const month = this.dateInput.value._d.getMonth() + 1;
      this.loadMonthlyReport(year, month);
    }
  }

  constructor(private layoutService: LayoutService,
    private reportService: ReportService) {
    this.layoutService.setLoading(false);
    this.layoutService.setLayout({ pageTitle: 'Monthly Complaint Chart', allowFooter: false });
  }

  ngOnInit() {
    const date = new Date();
    this.loadMonthlyReport(date.getFullYear(), date.getMonth() + 1);
  }


  loadMonthlyReport(year: number, month: number) {
    this.layoutService.setLoading(true);
    const data = [];
    const label = [];
    this.reportService.getmonthlyComplain(year, month).subscribe((x: any) => {
      data.push({ data: x.data.count, label: x.data.serviceProviderName });
      const monthlyComplainData = [];
      for (let i = 0; i < x.data.length; i++) {
        label.push(x.data[i].serviceProviderName);
        monthlyComplainData.push(x.data[i].count);
      }
      this.barChartData = [
        { data: monthlyComplainData, label: this.barChartData[0].label },
      ];
      this.barChartLabels = label;
      this.layoutService.setLoading(false);

    })
  }


}
