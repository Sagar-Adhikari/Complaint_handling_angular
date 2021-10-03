import { Component, ViewChild, AfterViewInit, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComplainService } from 'src/app/services/complain.service';
import { LayoutService } from 'src/app/layout.service';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complain-list',
  templateUrl: './complain-list.component.html',
  styleUrls: ['./complain-list.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({
        overflow: 'hidden',
        height: '*',
        width: '300px'
      })),
      state('true', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),

    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    ),
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ],
})
export class ComplainListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @Output() private complainSelected: EventEmitter<any> = new EventEmitter();

  private complainOfUserId: string;
  listType: string;
  isChildOfSlider = false;
  isMobile: any;
  pageTitle = 'Complain List';
  showFilter = false;
  data: any[] = [];
  statusList: any[] = [
    { id: '1', status: 'Pending' },
    { id: '2', status: 'Forwarded' },
    { id: '3', status: 'Progress' },
    { id: '4', status: 'Closed' }
  ];
  serviceProviderList: any[] = [];
  categoryList: any[] = [];
  maxDate = new Date();
  minDate = new Date();

  ticketNo: string;
  serviceProviderId: number;
  categoryId: number;
  statusId: number;
  createrEmail: string;
  mobileNo: string;
  fromDate = new FormControl();
  toDate = new FormControl();

  private filterParam = [];
  private sortField: string;
  pageSize: number;
  pageIndex: number;
  sortDirection: string;

  displayedColumns: string[] = ['id', 'serviceProvider', 'category', 'complain', 'createdOn', "status", "createdBy"];
  totalRows = 0;


  public clear() {
    this.listType = undefined;
    this.data = undefined;
    this.totalRows = 0;

  }
  public loadList(listType: string, id: string, title?: string) {
    this.listType = listType;
    this.complainOfUserId = undefined;

    if (listType === 'category') {
      this.categoryId = +id;
      this.pageTitle = title ? title : 'Complain list of category';
      this.displayedColumns = ['id', 'serviceProvider', 'complain', 'createdOn', "status", "createdBy"];
    } else if (listType === 'status') {
      this.statusId = +id;
      this.pageTitle = title ? title : 'Complain list of status';
      this.displayedColumns = ['id', 'serviceProvider', 'category', 'complain', 'createdOn', "createdBy"];
    } else if (listType === 'service-provider') {
      this.pageTitle = title ? title : 'Complain list of service provider';
      this.serviceProviderId = +id;
      this.displayedColumns = ['id', 'category', 'complain', 'createdOn', "status", "createdBy"];
    } else if (listType === 'user') {
      this.pageTitle = title ? title : 'Complain list of user';
      this.complainOfUserId = id;
      this.displayedColumns = ['id', 'serviceProvider', 'category', 'complain', 'createdOn', "status"];
    } else {
      this.pageTitle = title ? title : 'Complain list';
      this.displayedColumns = ['id', 'serviceProvider', 'category', 'complain', 'createdOn', "status", "createdBy"];
    }
    this.applyFilter();
  }
  constructor(private complainService: ComplainService,
    private layoutService: LayoutService,
    private router: Router,
    private _host: ElementRef) {
  }


  loadInitialData() {
    this.complainService.getServiceProviderList().subscribe(x => {
      if (x.success === true) {
        this.serviceProviderList = x.data;
      }
    });
  }

  serviceProviderChanged() {
    this.complainService.getCategoryByServiceProvider(this.serviceProviderId).subscribe(x => {
      this.categoryList = x.data;
    });
  }

  formDateChanged($event: any) {
    this.minDate = $event.value;
    this.toDate = new FormControl(this.minDate);
  }

  loadComplain() {
    if (this.listType) {
      this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
      this.pageIndex = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
      this.complainService.getList(this.pageIndex, this.pageSize, this.sortField, this.sortDirection, this.filterParam).subscribe(x => {
        x.data.forEach((el: { createdOn: any; complain: string }) => {
          el.createdOn = this.layoutService.getShortDateWithTime(el.createdOn);
          el.complain = el.complain.length > 50 ? el.complain.substr(0, 50) + '...' : el.complain;
        });
        this.totalRows = x.count;
        this.data = x.data;
      });
    }
    this.layoutService.setLoading(false);
  }

  ngAfterViewInit() {
    if ((this._host.nativeElement).closest('.panes')) {
      this.isChildOfSlider = true;
    } else {
      this.isChildOfSlider = false;
    }

    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === 'asc' ? 'ASC' : x.direction === 'desc' ? 'DESC' : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadComplain())
    ).subscribe();
  }

  applyFilter() {
    this.filterParam = [];
    if (this.ticketNo) { this.filterParam.push({ field: 'id', value: +this.ticketNo }) }
    if (this.serviceProviderId) { this.filterParam.push({ field: 'serviceProviderId', value: +this.serviceProviderId }) }
    if (this.mobileNo) { this.filterParam.push({ field: 'mobileNo', value: this.mobileNo }) }
    if (this.categoryId) { this.filterParam.push({ field: 'categoryId', value: +this.categoryId }) }
    if (this.createrEmail) { this.filterParam.push({ field: 'email', value: this.createrEmail }) }
    if (this.statusId) { this.filterParam.push({ field: 'statusId', value: +this.statusId }) }
    if (this.complainOfUserId) { this.filterParam.push({ field: 'complainOfUserId', value: this.complainOfUserId }) }
    if (this.fromDate.value) { this.filterParam.push({ field: 'date', from: this.fromDate.value, to: this.toDate.value ? this.toDate.value : undefined }) }
    this.loadComplain();
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.loadInitialData();
    this.loadComplain();
  }

  getComplain(id: string) {
    const url = `/get-complain/${id}`;
    if (!this.isChildOfSlider) {
      if (!this.router.isActive(url, true)) {
        this.layoutService.setLoading(true);
        this.router.navigate([url]);
      }
    } else {
      this.complainSelected.emit(id);
    }
  }
}
