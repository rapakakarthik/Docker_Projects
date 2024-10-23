import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ContactInfoComponent } from '../contact-info/contact-info.component';

@Component({
  selector: 'app-statutory',
  templateUrl: './statutory.component.html',
  styleUrls: ['./statutory.component.scss']
})
export class StatutoryComponent implements OnInit {
  form!: FormGroup;
  userObj: any; 

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public buyerProfileDetails: any,
    public dialogRef: MatDialogRef<ContactInfoComponent>
  ) {
    this.createContactForm();
  }
  ngOnInit(): void {
    this.updateForm();
  }

  // Creating Form
  createContactForm() {
    this.form = this.fb.group({
      gst_no: ['', Validators.required],
      pan_no: ['', Validators.required],
      tan_no: ['', Validators.required],
      cin_no: ['', Validators.required],
      dgft_code: ['', Validators.required],
      act_licence_no: ['', Validators.required],
      isno_no: ['', Validators.required],
    });
  }

  // Updating Form
  updateForm() {
    if (this.buyerProfileDetails) {
      this.form.patchValue({
        gst_no: this.buyerProfileDetails.gst_no,
        pan_no: this.buyerProfileDetails.pan_no,
        tan_no: this.buyerProfileDetails.tan_no,
        cin_no: this.buyerProfileDetails.cin_no,
        dgft_code: this.buyerProfileDetails.dgft_code,
        act_licence_no: this.buyerProfileDetails.act_licence_no,
        isno_no: this.buyerProfileDetails.isno_no,
      });
    }
  }

  // When Cliked on Submit
  submit(formData: any) {
    const buyerContactData = formData.value;
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }
    buyerContactData.user_id = this.userObj.buyerId;
    // console.log(buyerContactData);
    this.updateBuyerStatutoryInformation(buyerContactData);
  }

  // Sending data to API
  updateBuyerStatutoryInformation(obj: any) {
    this.crud.updateBuyerStatutoryInformation(obj).subscribe((res) => {
      if (res.status === 200) {
        this.toastr.success("Data Updated Successfully")
        this.closeDialog();
      } else {
        this.toastr.error('Check Data Fileds');
      }
    }, err => {
      this.toastr.error('Internal Server Error');
    });
  }

  // Closing Form
  closeDialog(): void {
    this.dialogRef.close();
  }
}


// not using