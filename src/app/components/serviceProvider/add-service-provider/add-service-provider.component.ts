import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-add-service-provider',
  templateUrl: './add-service-provider.component.html',
  styleUrls: ['./add-service-provider.component.scss']
})
export class AddServiceProviderComponent implements OnInit {
  @ViewChild('complainList', { static: true }) complainList: any;
  @ViewChild('sp', { static: true }) serviceProvicerName: ElementRef;
  serviceProviderForm: FormGroup;
  private serviceProviderId: number;

  serviceTypeList = [
    { id: 1, text: 'Data' },
    { id: 2, text: 'Voice' },
    { id: 3, text: 'Both' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private layoutService: LayoutService
  ) {

    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Add Service Provider' })
  }

  ngOnInit() {
    this.serviceProviderForm = new FormBuilder().group({
      name: ['', Validators.compose([Validators.required])],
      serviceTypeId: ["", Validators.compose([Validators.required])],
      isEnable: [true, Validators.compose([Validators.required,])],
    });
    this.activatedRoute.params.subscribe(params => {
      this.serviceProviderId = params.id;
      if (this.serviceProviderId != 0 && this.serviceProviderId != undefined) {
        this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Edit Service Provider' })
        this.serviceProviderService.getServiceProvider(this.serviceProviderId).subscribe((x: any): any => {
          this.serviceProviderForm.controls["name"].setValue(x.data.name);
          this.serviceProviderForm.controls["serviceTypeId"].setValue(x.data.serviceType.id);
          this.serviceProviderForm.controls["isEnable"].setValue(x.data.isEnable);
        });
      }
    });
    this.serviceProvicerName.nativeElement.focus();
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      if (!this.serviceProviderId) {
        this.serviceProviderService.addServiceProvider(value.name, value.serviceTypeId, value.isEnable).subscribe(x => {
          if (x.success) {
            this.layoutService.showMessageSuccess('Service provider added successfylly.');
            this.router.navigate(["/service-provider-list"]);
          } else {
            this.layoutService.showMessageError(x.message);
          }
        });

      } else {
        this.serviceProviderService.editServiceProvider(this.serviceProviderId.toString(), value.name, value.serviceTypeId, value.isEnable).subscribe((x: any) => {
          if (x.success) {
            this.layoutService.showMessageSuccess('Service provider edited successfully.');
          } else {
            this.layoutService.showMessageError(x.message);
          }
          this.router.navigate(['/service-provider-list']);
        }, (err) => {
          this.layoutService.showMessageError(err.message);
        });
      }
    } else {
      this.layoutService.showMessageError('Input(s) are not valid.')
    }
  }
}
