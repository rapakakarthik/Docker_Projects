import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ContactInfoComponent } from '../contact-info/contact-info.component';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit {
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
      land_mark: ['', Validators.required],
      locality_area: ['', Validators.required],
      country_name: ['', Validators.required],
      state_name: ['', Validators.required],
      city_name: ['', Validators.required],
      user_pincode: ['', Validators.required],
    });
  }

  // Updating Form
  updateForm() {
    if (this.buyerProfileDetails) {
      this.form.patchValue({
        land_mark: this.buyerProfileDetails.land_mark_address,
        locality_area: this.buyerProfileDetails.locality_area,
        country_name: this.buyerProfileDetails.country_name,
        state_name: this.buyerProfileDetails.state_name,
        city_name: this.buyerProfileDetails.city_name,
        user_pincode: this.buyerProfileDetails.user_pincode,
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
    this.updateBuyerContactInformation(buyerContactData);
  }

  // Sending data to API
  updateBuyerContactInformation(obj: any) {
    this.crud.updateBuyerAddressInformation(obj).subscribe((res) => {
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

