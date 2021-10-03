import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplainService } from 'src/app/services/complain.service';

@Component({
  selector: 'app-service-provider-dialog',
  templateUrl: './service-provider-dialog.component.html',
  styleUrls: ['./service-provider-dialog.component.scss']
})
export class ServiceProviderDialogComponent {
  spForm: FormGroup;
  serviceProviderList: any[] = [];
  title: 'Select Service Provider';
  constructor(private complainService: ComplainService,
    public dialogRef: MatDialogRef<ServiceProviderDialogComponent>
  ) {

    this.complainService.getServiceProviderList().subscribe(x => {
      if (x.success) {
        this.serviceProviderList = x.data;
      }
    });

    this.spForm = new FormBuilder().group({
      serviceProviderId: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      return;
    }
    this.dialogRef.close({ serviceProviderId: value.serviceProviderId });
  }
}
