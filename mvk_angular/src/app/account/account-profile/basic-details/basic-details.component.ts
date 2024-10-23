import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent implements OnInit {
  userObj: any;
  selectedValues: string[] = [];
  user: any;

  constructor(
    private rfq: RfqService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public details: any,
    public dialogRef: MatDialogRef<BasicDetailsComponent>
  ) {
    this.createBasicDetailsForm();
  }
  ngOnInit(): void {
    this.user = this.details.user;
    this.getDropDowns();
    this.updateForm();
  }

  // Creating Form
  form!: FormGroup;
  createBasicDetailsForm() {
    this.form = this.fb.group({
      title: ['', ],
      name: ['', ],
      email: ['',],
    });
  }

  titles: any[] = [];
  getDropDowns() {
    this.rfq.getDropDowns().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.titles = res.data.pre_salutations;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('dropdown error', err.message)
      }
    });
  }

  // Updating the form
  updateForm() {
    if(this.user) {
      this.form.patchValue({
        name: this.user.mob_first_name,
        email: this.user.mob_email,
      });
      if(this.user.name_salutations) {
        this.form.patchValue({
          title: this.user.name_salutations
        })
      }
    }
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

