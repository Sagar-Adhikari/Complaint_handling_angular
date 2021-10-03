import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { ComplainService } from 'src/app/services/complain.service';
import { MatDialog } from '@angular/material';
import { LayoutService } from 'src/app/layout.service';
import { ComplainDialogComponent } from '../complain-dialog/complain-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-complain-details',
  templateUrl: './complain-details.component.html',
  styleUrls: ['./complain-details.component.scss']
})
export class ComplainDetailsComponent implements OnInit, AfterViewInit {
  private iconPath = environment.icon_image_path + 'upload/files/';
  imgUrl = '';

  searchId: any;
  private _complainId: string = '';
  isChildOfSlider = false;
  isMobile: any;
  data: any;
  dataSource: any[] = [];
  displayedColumns = ["title", "value"];
  followupColumns = ["createdOn", "user", "remarks"];

  @Input()
  set complainId(val: string) {
    this._complainId = val;
    if (val) {
      this.searchId = val
      this.search();
    }
  }

  get complainId(): string {
    return this._complainId;
  }

  roleId: number;
  serviceProviderId: number;

  constructor(
    private complainService: ComplainService,
    public layoutService: LayoutService,
    private route: ActivatedRoute,
    private _host: ElementRef,
    public dialog: MatDialog,
    private authService: AuthService) {

    this.authService.currentUser$.subscribe(x => {
      if (x) {
        this.roleId = x.roleId;
        this.serviceProviderId = x.serviceProviderId;
      } else {
        this.roleId = undefined;
        this.serviceProviderId = undefined;
      }

    });
  }

  ngAfterViewInit() {
    this.isChildOfSlider = (this._host.nativeElement).closest('.panes') ? true : false;
    if (!this.isChildOfSlider) {
      this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Complain Details' });
    }
  }
  search() {
    if (this.searchId) {
      this.layoutService.setLoading(true);
      this.complainService.getComplain(+this.searchId).subscribe(x => {
        if (x.success) {
          this.data = x.data
          this.imgUrl = this.iconPath + x.data.filePath;
          console.log('img Url ',this.imgUrl);

          this.dataSource = [];
          this.dataSource.push({ title: 'Ticket No:', value: x.data.id });
          this.dataSource.push({ title: 'Service Provider', value: x.data.serviceProvider.name });
          this.dataSource.push({ title: 'Category', value: x.data.category.category });

          if (x.data.category.serviceTypeId === 1) {
            this.dataSource.push({ title: 'Mobile No:', value: x.data.mobileOrUserId });
          } else {
            this.dataSource.push({ title: 'User Id:', value: x.data.mobileOrUserId });
          }
          this.dataSource.push({ title: 'Service Provider Ticket No:', value: x.data.serviceProviderTicketNo });

          this.dataSource.push({ title: 'Complain:', value: x.data.complain });
          this.dataSource.push({ title: 'Status', value: x.data.status.status });

          this.dataSource.push({ title: 'Created On:', value: this.layoutService.getShortDateWithTime(x.data.createdOn) });
          this.dataSource.push({ title: 'Created By:', value: `${x.data.createdByUser.firstName} ${x.data.createdByUser.lastName} / ${x.data.createdByUser.email}` });
          if (x.data.forwardedOn) {
            this.dataSource.push({ title: 'Forwarded On:', value: this.layoutService.getShortDateWithTime(x.data.forwardedOn) });
          }

          if (this.data.assignToUser) {
            this.dataSource.push({ title: 'Assigned To:', value: `${x.data.assignToUser.firstName} ${x.data.assignToUser.lastName} / ${x.data.assignToUser.email}` });
            this.dataSource.push({ title: 'Assigned On:', value: this.layoutService.getShortDateWithTime(x.data.assignedOn) });
          }

          if (this.data.closedByUser) {
            this.dataSource.push({ title: 'Closed Remarks:', value: x.data.closedRemarks });
            this.dataSource.push({ title: 'Closed On:', value: this.layoutService.getShortDateWithTime(x.data.closedOn) });
            this.dataSource.push({ title: 'Closed By:', value: `${x.data.closedByUser.firstName} ${x.data.closedByUser.lastName} / ${x.data.closedByUser.email}` });
          }

          // if (this.data.actionTaken) {
          //   this.dataSource.push({ title: 'Handling By:', value: x.data.createdByUser.email });
          //   this.dataSource.push({ title: 'Remarks:', value: x.data.closedRemarks });
          // }
          this.layoutService.setLoading(false);

        } else {
          this.data = undefined;
          this.dataSource = [];
          this.layoutService.showMessageError(x.message);
        }
      });
    } else {
      this.data = undefined;
      this.dataSource = [];
    }

  }
  ngOnInit() {
    setTimeout(() => {
      if (!this.isChildOfSlider) {
        const routeComplainId = this.route.snapshot.paramMap.get('id');
        if (routeComplainId) {
          this.complainId = routeComplainId;
        } else {
          this.layoutService.setLoading(false);
        }
      }
    });


  }

  openDialog(action: number): void {
    const dialogRef = this.dialog.open(ComplainDialogComponent, {
      width: '500px',
      data: {
        complainId: this.complainId,
        status: this.data.status.id,
        action: action,
        serviceProviderId: this.data.serviceProvider.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 1) {
          this.layoutService.showMessageSuccess('Complain successfully forwarded to service provider.');
        }
        this.search();
      }
    });
  }
}
