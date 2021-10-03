import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LayoutService } from 'src/app/layout.service';
import { ReportService } from '../report.service';
import { MatSort } from '@angular/material/sort';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  fDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  tDate = new Date();

  isMobile: any;

  title = `Summary Report`;
  subTitle = '';
  data: any[] = [];
  private tempData: any[] = [];
  displayedColumns: string[] = ['serviceProviderName', 'pending', 'forwarded', 'progress', 'resolved', 'total'];

  sortField: string = "total";
  sortDirection: string = "desc";

  constructor(
    private reportService: ReportService,
    private layoutService: LayoutService
  ) {
    this.layoutService.setLayout({ pageTitle: this.title, allowFooter: false });
    this.loadComplainSummary();
  }

  loadComplainSummary() {
    this.layoutService.setLoading(true);
    this.subTitle = `From ${this.formatDate(this.fDate)} To  ${this.formatDate(this.tDate)} `;
    this.reportService.getSummary(this.fDate, this.tDate).subscribe((x: any) => {
      this.data = x.data;
      this.tempData = [...this.data];
      this.sortField = "total";
      this.sortDirection = "desc";
      this.layoutService.setLoading(false);
    });
  }

  ngAfterViewInit() {
    this.data = [];
    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.sortField = x.active;
      this.sortDirection = x.direction;
    });

    merge(this.sort.sortChange).pipe(
      tap(() => this.sortData())
    ).subscribe();
  }

  sortData() {
    this.data = [...this.tempData];

    if (this.sortField === "serviceProviderName") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) {
          var nameA = a.serviceProviderName.toUpperCase();
          var nameB = b.serviceProviderName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) {
          var nameA = a.serviceProviderName.toUpperCase();
          var nameB = b.serviceProviderName.toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
      }
    } else if (this.sortField === "forwarded") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) { return a.forwarded - b.forwarded });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) { return b.forwarded - a.forwarded });
      }
    } else if (this.sortField === "pending") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) { return a.pending - b.pending });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) { return b.pending - a.pending });
      }
    } else if (this.sortField === "progress") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) { return a.progress - b.progress });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) { return b.progress - a.progress });
      }
    } else if (this.sortField === "resolved") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) { return a.resolved - b.resolved });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) { return b.resolved - a.resolved });
      }
    } else if (this.sortField === "total") {
      if (this.sortDirection === "asc") {
        this.data.sort(function (a: any, b: any) { return a.total - b.total });
      } else if (this.sortDirection === "desc") {
        this.data.sort(function (a: any, b: any) { return b.total - a.total });
      }
    }

  }

  dateChange(value: string, flag: string) {
    this.loadComplainSummary();

  }

  formatDate(x: any): string {
    const d = new Date(x).toLocaleDateString();
    const t = new Date(x).toLocaleTimeString();
    return `${d} ${t}`
  }

  exportToPdf(data: any) {
    let doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(74, 20, 'Complaint ' + this.title);
    doc.setFontSize(10);
    doc.text(60, 30, this.subTitle);

    const col = ['Service Provider', 'Pending', 'Forwarded', 'Progress', 'Resolved', 'Total'];
    let rows = [];

    data.forEach(x => {
      let temp = [x.serviceProviderName, x.pending, x.forwarded, x.progress, x.resolved, x.total];
      rows.push(temp);
    });

    doc.autoTable(col, rows, {
      theme: "plain",
      styles: {
        overflow: 'linebreak',
        lineWidth: 0.02,
        lineColor: [128, 128, 128]
      },
      startY: 35,
      margin: {
        top: 60
      },
    });

    doc.save('Summary_Report.pdf');
  }

  ngOnInit() {
  }
}

