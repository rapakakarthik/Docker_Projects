import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ContactInfoComponent } from '../contact-info/contact-info.component';

@Component({
  selector: 'app-intelletual',
  templateUrl: './intelletual.component.html',
  styleUrls: ['./intelletual.component.scss']
})
export class IntelletualComponent implements OnInit {
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
      trademark_no: ['', Validators.required],
      patent_no: ['', Validators.required],
      copyright_no: ['', Validators.required],
    });
  }

  // Updating Form
  updateForm() {
    if (this.buyerProfileDetails) {
      this.form.patchValue({
        trademark_no: this.buyerProfileDetails.trademark_no,
        patent_no: this.buyerProfileDetails.patent_no,
        copyright_no: this.buyerProfileDetails.copyright_no,
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
    this.updateBuyerIntelletualInformation(buyerContactData);
  }

  // Sending data to API
  updateBuyerIntelletualInformation(obj: any) {
    this.crud.updateBuyerIntelletualInformation(obj).subscribe((res) => {
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