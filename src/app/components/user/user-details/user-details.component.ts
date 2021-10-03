import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LayoutService } from 'src/app/layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { ServiceProviderDialogComponent } from '../service-provider-dialog/service-provider-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('complainList', { static: false }) complainList: any;
  @ViewChild('slider', { static: true }) slider: any;

  user: any;
  roleId: number;
  serviceProviderId: number;
  email: string;
  complainId: string = '';
  isTopVisible = true;

  sliderClicked(event: any) {
    if (event === 'top') {
      this.isTopVisible = false
    } else {
      this.isTopVisible = true;
    }
  }

  search() {
    this.layoutService.setLoading(true);
    this.userService.getUser(this.email).subscribe(x => {
      if (x.success) {
        x.data.emailVerified ? 'Yes' : 'No';
        this.user = x.data;
        this.complainList.loadList("user", x.data.id);
        this.layoutService.setLoading(false);
      } else {
        this.user = undefined
        this.complainList.clear();
        if (this.email) {
          this.layoutService.showMessageError('Email not found!');
        } else {
          this.layoutService.setLoading(false);
        }
      }
    });
  }

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private authSerivce: AuthService,
    public dialog: MatDialog
  ) {
    this.authSerivce.currentUser$.subscribe(x => {
      if (x) {
        this.roleId = x.roleId;
        this.serviceProviderId = x.serviceProviderId;
      } else {
        this.roleId = undefined;
        this.serviceProviderId = undefined;
      }

    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: "User Details" });
  }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUser(null, userId).subscribe(x => {
        if (x.success) {
          this.user = x.data;
          this.email = this.user.email;
          this.complainList.loadList("user", x.data.id);
          this.layoutService.setLoading(false);
        } else {
          this.user = undefined
          this.complainList.clear();
          this.layoutService.showMessageWarning("Email not found!");
        }
      });
    } else {
      this.layoutService.setLoading(false);
    }
  }

  setAsNTAAdmin() {
    this.layoutService.setLoading(true);
    this.userService.setNTAAdminRole(this.user.id).subscribe(x => {
      if (x.success) {
        this.layoutService.showMessageSuccess(x.message);
        this.search();
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    })
  }

  setAsNTAUser() {
    this.layoutService.setLoading(true);

    this.userService.setNTAUserRole(this.user.id).subscribe(x => {
      if (x.success) {
        this.layoutService.showMessageSuccess(x.message);
        this.search();
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    })
  }


  setAsSPAdmin(serviceProviderId: number) {
    this.layoutService.setLoading(true);
    this.userService.setServiceProviderAdminRole(this.user.id, serviceProviderId).subscribe(x => {
      if (x.success) {
        this.layoutService.showMessageSuccess(x.message);
        this.search();
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    })
  }

  setAsSPUser() {
    this.layoutService.setLoading(true);
    this.userService.setServiceProviderUserRole(this.user.id).subscribe(x => {
      if (x.success) {
        this.layoutService.showMessageSuccess(x.message);
        this.search();
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    })
  }

  resetRole() {
    this.layoutService.setLoading(true);
    this.userService.resetRole(this.user.id).subscribe(x => {
      if (x.success) {
        this.layoutService.showMessageSuccess(x.message);
        this.search();
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    })
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceProviderDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (result.serviceProviderId) {
          this.setAsSPAdmin(result.serviceProviderId);
        }
      }
    });
  }

  showComplain(id: string) {
    this.complainId = id;
    this.isTopVisible = false;
  }
}
