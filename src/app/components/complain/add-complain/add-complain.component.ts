import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { ComplainService } from 'src/app/services/complain.service';
import { MatSelect } from '@angular/material';
import { Router } from '@angular/router';
import { IAddComplain } from 'src/app/interfaces/complain';

@Component({
  selector: 'app-add-complain',
  templateUrl: './add-complain.component.html',
  styleUrls: ['./add-complain.component.scss']
})
export class AddComplainComponent implements OnInit, AfterViewInit {
  complainForm: FormGroup;
  serviceProviderList: any;
  categoryList: any;
  private catList: any;
  lblMobileOrUserId = "Mobile No";
  lblMobileOrUserHint = "Enter your mobile no.";
  selectedFile = null;
  @ViewChild('sp', { static: false }) elSP: MatSelect;
  public spFieldShow: boolean = false;
  imgUrl: any;


  constructor(
    private layoutService: LayoutService,
    private complainService: ComplainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.complainService.getServiceProviderList().subscribe(x => {
      this.serviceProviderList = x.data;
    });
    this.complainForm = new FormBuilder().group({
      serviceProviderId: ['', Validators.compose([Validators.required])],
      categoryId: ['', Validators.compose([Validators.required])],
      mobileOrUserId: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      serviceProviderTicketNo: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      complain: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(500)])],
      file: []
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Add Complain Page' });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.elSP.focused = true;
    });
    this.layoutService.setLoading(false);

  }

  onFileSelected(event: any) {
    this.layoutService.setLoading(false);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
        this.layoutService.setLoading(false);
      };
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedFile = null;
      this.imgUrl = null;
    }
  }


  serviceProviderChanged() {
    const serviceProviderId = this.complainForm.controls.serviceProviderId.value;
    if (serviceProviderId === 1) {
      this.spFieldShow = true;
      this.complainForm.get('mobileOrUserId').disable();
      this.complainForm.get('serviceProviderTicketNo').disable();
    } else {
      this.spFieldShow = false;
      this.complainForm.get('mobileOrUserId').enable();
      this.complainForm.get('serviceProviderTicketNo').enable();
    }

    this.complainService.getCategoryByServiceProvider(serviceProviderId).subscribe(x => {
      this.catList = [];
      this.catList = [...x.data]
      this.categoryList = x.data;
    });
  }

  categoryChanged() {
    const catId = this.complainForm.controls.categoryId.value;
    const selectedCategory = this.catList.filter(x => x.id === catId);
    if (selectedCategory.length > 0) {
      if (selectedCategory[0].serviceTypeId === 1) {

        this.lblMobileOrUserId = "Mobile No";
        this.lblMobileOrUserHint = "Enter your mobile no.";
      } else {
        this.lblMobileOrUserId = "User Id";
        this.lblMobileOrUserHint = "Enter your user id.";
      }
    }

  }
  onSubmit({ value, valid }: { value: IAddComplain, valid: boolean }) {
    if (valid) {
      this.layoutService.setLoading(true);
      var fd = new FormData();
      fd.append("serviceProviderId", value.serviceProviderId.toString());
      fd.append("categoryId", value.categoryId.toString());
      fd.append("mobileOrUserId", value.mobileOrUserId);
      fd.append("serviceProviderTicketNo", value.serviceProviderTicketNo);
      fd.append("complain", value.complain);
      if (this.selectedFile) {
        const file: File = this.selectedFile;
        fd.append("file", file, file.name);
      }
      this.complainService.addComplain(fd).subscribe(x => {
        if (x.success) {
          const y = x.data;
          this.layoutService.showMessageSuccess('Complain added successfully!');
          this.router.navigate(['my-complain']);
        } else {
          this.layoutService.showMessageError(x.message);

        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message);
      });
    } else {
      this.elSP.focused = true;
      this.layoutService.showMessageInfo('Error! Inputs are incorrect or invalid!');
    }
  }
}
