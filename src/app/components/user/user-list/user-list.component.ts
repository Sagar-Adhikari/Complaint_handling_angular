
import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComplainService } from 'src/app/services/complain.service';
import { LayoutService } from 'src/app/layout.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
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
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  showFilter = false;
  data: any[] = [];
  operatorRoleId: number;
  operatorServiceProviderId: number;
  isMobile: any;

  roleList: any[] = [
    { id: '2', roleName: 'Normal User' },
    { id: '3', roleName: 'NTA Admin' },
    { id: '4', roleName: 'NTA User' },
    { id: '5', roleName: 'Service Provider Admin' },
    { id: '6', roleName: 'Service Provider User' },
  ];

  serviceProviderList: any[] = [];

  firstName: string;
  lastName: string;
  roleId: number;
  email: string;
  mobileNo: string;
  status: boolean;
  serviceProviderId: number;
  private filterParam = [];

  private sortField: string;
  pageSize: number;
  pageIndex: number;
  sortDirection: string;

  displayedColumns: string[] = ['userName', 'email', 'mobileNo', "role", "serviceProvider", "status", "createdOn"];
  totalRows = 0;

  constructor(
    private userService: UserService,
    private complainService: ComplainService,
    private authService: AuthService,
    private layoutService: LayoutService) {
    this.authService.currentUser$.subscribe(x => {
      if (x) {
        this.operatorRoleId = x.roleId;
        this.operatorServiceProviderId = x.serviceProviderId;
        if (this.operatorRoleId === 1) {
          this.roleList = [
            { id: '2', roleName: 'Normal User' },
            { id: '3', roleName: 'NTA Admin' },
            { id: '4', roleName: 'NTA User' },
            { id: '5', roleName: 'Service Provider Admin' },
            { id: '6', roleName: 'Service Provider User' },
          ];
        } else if (this.operatorRoleId === 3) {
          this.roleList = [
            { id: '2', roleName: 'Normal User' },
            { id: '3', roleName: 'NTA Admin' },
            { id: '4', roleName: 'NTA User' },
            { id: '5', roleName: 'Service Provider Admin' },
            { id: '6', roleName: 'Service Provider User' },
          ];
        } else if (this.operatorRoleId === 4) {
          this.roleList = [
            { id: '2', roleName: 'Normal User' },
            { id: '4', roleName: 'NTA User' },
            { id: '5', roleName: 'Service Provider Admin' },
            { id: '6', roleName: 'Service Provider User' },
          ];
        } else if (this.operatorRoleId === 5) {
          this.roleList = [
            { id: '2', roleName: 'Normal User' },
            { id: '5', roleName: 'Service Provider Admin' },
            { id: '6', roleName: 'Service Provider User' },
          ];
        }
      }
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'User List' })
  }

  loadInitialData() {
    this.complainService.getServiceProviderList().subscribe(x => {
      if (x.success === true) {
        if (this.operatorServiceProviderId) {
          this.serviceProviderList = x.data.filter(x => x.id == this.operatorServiceProviderId);
        }
      }
    });
  }

  loadUser() {
    this.layoutService.setLoading(true);
    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    this.pageIndex = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    this.userService.getList(this.pageIndex, this.pageSize, this.sortField, this.sortDirection, this.filterParam).subscribe(x => {
      if (x.success) {
        x.data.list.forEach((el: { createdOn: any; complain: string }) => {
          el.createdOn = this.layoutService.getShortDateWithTime(el.createdOn);
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
      tap(() => this.loadUser())
    ).subscribe();
  }

  applyFilter() {
    this.filterParam = [];
    if (this.firstName) { this.filterParam.push({ field: 'firstName', value: this.firstName }) }
    if (this.lastName) { this.filterParam.push({ field: 'lastName', value: this.lastName }) }
    if (this.roleId) { this.filterParam.push({ field: 'roleId', value: +this.roleId }) }
    if (this.mobileNo) { this.filterParam.push({ field: 'mobileNo', value: this.mobileNo }) }
    if (this.email) { this.filterParam.push({ field: 'email', value: this.email }) }
    if (this.status) { this.filterParam.push({ field: 'status', value: this.status }) }
    if (this.serviceProviderId) { this.filterParam.push({ field: 'serviceProviderId', value: +this.serviceProviderId }) }
    this.loadUser();
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.loadInitialData();
    this.loadUser();
  }

}
