import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-service-provider-details',
  templateUrl: './service-provider-details.component.html',
  styleUrls: ['./service-provider-details.component.scss']
})
export class ServiceProviderDetailsComponent implements OnInit {
  @ViewChild('complainList', { static: true }) complainList: any;
  @ViewChild('slider', { static: true }) slider: any;

  serviceProviderData: any;
  name: string;
  private serviceProviderId: number;

  isFirstPage = true;
  complainId: string = '';

  sliderClicked(event: any) {
    if (event === 'left') {
      this.isFirstPage = false
    } else {
      this.isFirstPage = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private serviceProviderService: ServiceProviderService,
    public layoutService: LayoutService,
    private router: Router

  ) {
    this.layoutService.setLayout({ pageTitle: 'Service Provider Details', allowFooter: false });
  }

  ngOnInit() {
    this.serviceProviderId = +this.route.snapshot.paramMap.get('id');
    if (this.serviceProviderId) {
      this.serviceProviderService.getServiceProvider(this.serviceProviderId).subscribe(x => {
        if (x.success) {
          this.serviceProviderData = x.data;
          this.name = this.serviceProviderData.name;
          this.complainList.loadList("service-provider", this.serviceProviderId);
          this.layoutService.setLoading(false);
        } else {
          this.serviceProviderData = undefined;
          this.complainList.clear();
          this.layoutService.showMessageWarning("service Provider not found!");
        }
      });
    } else {
      this.layoutService.setLoading(false);
    }
  }
  deleteServiceProvider() {
    this.layoutService.setLoading(true);
    this.serviceProviderService.deleteServiceProvider(this.serviceProviderId).subscribe((x: any) => {
      if (x.success) {
        this.layoutService.showMessageSuccess('Service provider deleted successfully');
        this.router.navigate(['/service-provider-list']);
      } else {
        this.layoutService.showMessageError(x.message);
      }
    }, err => {
      this.layoutService.showMessageError(err.message);
    });
  }

  showComplain(id: string) {
    this.complainId = id;
    this.isFirstPage = false;
  }
}
