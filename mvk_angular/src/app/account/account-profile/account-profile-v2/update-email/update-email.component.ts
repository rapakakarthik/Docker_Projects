import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { BasicDetailsComponent } from '../../basic-details/basic-details.component';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss'
})
export class UpdateEmailComponent implements OnInit{
  // dialogRef: any;
  // closeEmailDialog(): void {
  //   this.dialogRef.close();
  // }

  showEmail = true
  user: any;
  constructor(
    private rfq: RfqService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public details: any,
    public dialogRef: MatDialogRef<BasicDetailsComponent>
  ) {
  }
  ngOnInit(): void {
    this.user = this.details.user;
    this.showEmail = this.details.type == 'email'
  }


  // When Clicked on Update Details Button
  submit(formData: any) {
    const buyerCompanyData = formData.value;
    const submitData = {
      name_salutation: buyerCompanyData.title,
      user_name: buyerCompanyData.name,
      mob_email: this.user.mob_email,
      mob_user_phone: this.user.mob_user_phone,
    };    
    this.updateUser(submitData);
  }
  // Sending Data To API
  updateUser(obj: any) {
    this.rfq.updateUserPersonaletails(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Updated Successfully");
          this.closeDialog();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('dropdown error', err.message)
      }
    })
  }

  // Closing Component
  closeDialog(): void {
    this.dialogRef.close();
  }

  hideEmail() {
    this.closeDialog();
  }

}
