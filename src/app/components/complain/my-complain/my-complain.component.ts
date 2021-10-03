import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-my-complain',
  templateUrl: './my-complain.component.html',
  styleUrls: ['./my-complain.component.scss']
})
export class MyComplainComponent implements OnInit {
  @ViewChild('myComplain', { static: true }) myComplain: any;
  private userId: string;

  constructor(private authService: AuthService, private layoutService: LayoutService) {
    this.authService.currentUser$.subscribe(x => {
      if (x) {
        this.userId = x.userId;
      }
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: "My Complain" });

  }

  ngOnInit() {
    this.myComplain.loadList('user', this.userId, 'Complain List');
    this.layoutService.setLoading(false);
  }
}
