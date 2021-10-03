import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
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


export class CategoryListComponent implements OnInit {
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
    { id: '0', text: 'Disable' },
    { id: ' 1', text: 'Enable' }
  ];

  categoryName: string;
  status: boolean;
  serviceTypeId: number;
  statusId: number;

  private filterParam = [];

  private sortField: string;
  pageSize: number;
  pageIndex: number;
  sortDirection: string;
  isMobile: any;

  displayedColumns: string[] = ['category', 'serviceType', 'status', 'createdOn', 'action'];
  totalRows = 0;

  constructor(
    private categoryService: CategoryService,
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
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Category List' });
  }

  loadCategory() {
    this.layoutService.setLoading(true);
    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    this.pageIndex = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    this.categoryService.getList(this.pageIndex, this.pageSize, this.sortField, this.sortDirection, this.filterParam).subscribe(x => {
      if (x.success) {
        x.data.list.forEach((el: { createdOn: any; }) => {
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
      tap(() => this.loadCategory())
    ).subscribe();
  }

  applyFilter() {
    this.filterParam = [];
    if (this.categoryName) { this.filterParam.push({ field: 'category', value: this.categoryName }) }
    if (this.statusId) { this.filterParam.push({ field: 'isEnable', value: this.statusId == 0 ? false : true }) }
    if (this.serviceTypeId) { this.filterParam.push({ field: 'serviceTypeId', value: +this.serviceTypeId }) }
    this.loadCategory();
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.loadCategory();
  }
  addNew() {
    this.router.navigate(['add-category']);
  }

}