import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-complain-list-container',
  templateUrl: './complain-list-container.component.html',
  styleUrls: ['./complain-list-container.component.scss']
})
export class ComplainListContainerComponent implements OnInit {
  @ViewChild('complain', { static: true }) complain: any;
  private id: string;
  constructor(private authService: AuthService, private layoutService: LayoutService) {
    this.layoutService.setLayout({ pageTitle: 'Complain List', allowFooter: true });

  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(x => {
      if (x) {
        const roleId = x.roleId;
        const serviceProviderId = x.serviceProviderId;
        const userId = x.userId;
        if (userId && roleId) {
          if (roleId >= 5) {
            this.complain.loadList('service-provider', serviceProviderId)
          } else if (roleId === 2) {
            this.complain.loadList('user', userId, 'Complain List');
          } else if (roleId >= 3) {
            this.complain.loadList('nta', userId, 'Complain List');
          }
        }
      }
    })
  }
}
