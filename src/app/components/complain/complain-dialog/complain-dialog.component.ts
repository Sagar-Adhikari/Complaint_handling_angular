import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplainService } from 'src/app/services/complain.service';
import { UserService } from 'src/app/services/user.service';

export interface DialogData {
  complainId: number;
  serviceProviderId: number;
  status: number;
  action: number;
}

@Component({
  selector: 'app-complain-dialog',
  templateUrl: './complain-dialog.component.html',
  styleUrls: ['./complain-dialog.component.scss']
})

export class ComplainDialogComponent {
  statusForm: FormGroup;
  title: string;
  remarks: string;
  disabled = false;
  userList: any[] = [{ id: 'asdfasf', email: "saujannya@gmail.com" }, { id: 'asdfasf1', email: "saujannya@gmail1.com" }];
  constructor(private complainService: ComplainService, private userService: UserService,
    public dialogRef: MatDialogRef<ComplainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.action === 1) { //Forward
      this.title = "Do you want to forward this complain to service provider?";
    } else if (data.action === 2) { //Assign
      this.userService.getList(0, 99999999, "email", "ASC", []).subscribe(x => {
        if (x.success) {
          this.userList = x.data.list
        }
      })
      this.statusForm = new FormBuilder().group({
        userId: ['', Validators.compose([Validators.required])]
      });
      this.title = "Select whom you want to assign this complain?"
    } else if (data.action === 3) { //Progress
      this.statusForm = new FormBuilder().group({
        remarks: ['', Validators.compose([Validators.required])]
      });
      this.title = "Please enter remarks and click on save"
    } else if (data.action === 4) { //Close
      this.statusForm = new FormBuilder().group({
        remarks: ['', Validators.compose([Validators.required])]
      });
      this.title = "Please enter remarks of resolve and click on save."
    } else if (data.action === 5) { //action
      this.statusForm = new FormBuilder().group({
        emailId: ['', Validators.compose([Validators.required])],
        remarks: ['', Validators.compose([Validators.required])]
      });
      this.title = "Please enter email and remarks then click on save"
    }
  }

  onNoClick(): void {
    this.dialogRef.close();

  }
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      return;
    }

    this.disabled = true;
    if (this.data.action === 4) {
      this.complainService.close(this.data.complainId, value.remarks).subscribe(x => {
        if (x.success) {
          this.dialogRef.close(this.data);
        }
      });
    } else if (this.data.action === 3) {
      this.complainService.followUp(this.data.complainId, value.remarks).subscribe(x => {
        if (x.success) {
          this.dialogRef.close(this.data);
        }
      });
    } else if (this.data.action === 2) {
      this.complainService.assign(this.data.complainId, value.userId).subscribe(x => {
        if (x.success) {
          this.dialogRef.close(this.data);
        }
      });
    }
    else if (this.data.action === 5) {
      this.complainService.action(this.data.complainId, value.remarks, value.emailId).subscribe(x => {
        if (x.success) {
          this.dialogRef.close(this.data);
        }
      });
    }
  }

  forward() {
    this.disabled = true;
    this.complainService.forward(this.data.complainId).subscribe(x => {
      this.dialogRef.close(this.data);
    });
  }
}
