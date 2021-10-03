import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/layout.service';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-service-provider-list',
  templateUrl: './service-provider-list.component.html',
  styleUrls: ['./service-provider-list.component.scss'],
  animations: [
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


export class ServiceProviderListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  showFilter = false;
  data: any[] = [];
  operatorRoleId: number;
  serviceTypeList = [
    { id: 1, text: 'Data' },
    { id: 2, text: 'Voice' },
    { id: 3, text: 'Both' }
  ];

  statusList = [
   
    { id: '1', text: 'Enable' },
    { id: '0', text: 'Disable' }
  ];

  serviceProviderName: string;
  status: boolean;
  serviceTypeId: number;
  statusId:number;

  private filterParam = [];

  private sortField: string;
  pageSize: number;
  pageIndex: number;
  sortDirection: string;
  isMobile: any;
  displayedColumns: string[] = ['name', 'serviceType', 'status', "lastUpdatedOn", 'action'];
  totalRows = 0;

  constructor(
    private serviceProviderService: ServiceProviderService,
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router
  ) {

    this.authService.currentUser$.subscribe((x: any) => {
      if (x) {
        this.operatorRoleId = x.roleId;
      } else {
        this.operatorRoleId = undefined;
      }

    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Service Provider List' });
  }

  loadServiceProvider() {
    this.layoutService.setLoading(true);
    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    this.pageIndex = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    this.serviceProviderService.getList(this.pageIndex, this.pageSize, this.sortField, this.sortDirection, this.filterParam).subscribe(x => {
      if (x.success) {
        x.data.list.forEach((el: { lastUpdatedOn: any; complain: string }) => {
          el.lastUpdatedOn = this.layoutService.getShortDateWithTime(el.lastUpdatedOn);
        });
        this.totalRows = x.data.count;
        this.data = x.data.list;
        this.layoutService.setLoading(false);
      } else {
        this.layoutService.showMessageInfo(x.message);
      }
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === 'asc' ? 'ASC' : x.direction === 'desc' ? 'DESC' : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadServiceProvider())
    ).subscribe();
  }

  applyFilter() {
    this.filterParam = [];
    if (this.serviceProviderName) { this.filterParam.push({ field: 'name', value: this.serviceProviderName }) }
    if (this.statusId) { this.filterParam.push({ field: 'isEnable', value: this.statusId==0?false:true}) }
    if (this.serviceTypeId) { this.filterParam.push({ field: 'serviceTypeId', value: +this.serviceTypeId }) }

    this.loadServiceProvider();
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.loadServiceProvider();
  }
  addNew() {
    this.router.navigate(['add-service-provider']);
  }

}