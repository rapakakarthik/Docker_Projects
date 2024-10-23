import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-sourcing-info',
  templateUrl: './sourcing-info.component.html',
  styleUrls: ['./sourcing-info.component.scss'],
})
export class SourcingInfoComponent implements OnInit {
  form!: FormGroup;
  myForm!: FormGroup;
  userObj: any;
  dropdowns: any;
  sourcingPurpose: any[] = [];
  sourcingFrequency: any[] = [];
  supplierQualifications: any[] = [];
  purchaseVolume: any[] = [];

  constructor(
    private crud: CrudService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public buyerProfileDetails: any,
    public dialogRef: MatDialogRef<SourcingInfoComponent>
  ) {
    this.createSourceForm();
  }
  ngOnInit(): void {
    this.updateForm()
  }

  // Creating Form
  createSourceForm() {
    this.form = this.fb.group({
      purchasing_volume: ['', Validators.required],
      sourcing_purpose: this.fb.array([]),
      sourcing_frequency: [''],
      // preferred_industries: ['', Validators.required],
      supplier_qualifications: this.fb.array([]),
    });
    this.getBuyerUpdateProfileDropdown();
  }

  // Getting dynamic fields
  getBuyerUpdateProfileDropdown() {
    this.crud.getBuyerUpdateProfileDropdown().subscribe((res) => {
      if (res.status === 200) {
        this.dropdowns = res.dropdowns;
        this.sourcingPurpose = this.dropdowns.primary_source;
        this.supplierQualifications = this.dropdowns.supplier_qualifications;
        this.sourcingFrequency = this.dropdowns.average_source;
        this.purchaseVolume = this.dropdowns.annual_purchasing_volume;
        this.addCheckboxes();
        // this.initializeForm()
      }
    });
  }  

  get sourcingPurposeArray() {
    return this.form.get('sourcing_purpose') as FormArray;
  }
  get supplierQualificationsArray() {
    return this.form.get('supplier_qualifications') as FormArray;
  }

  // Adding fields dynamically 
  addCheckboxes() {
    for (const item of this.sourcingPurpose) {
      const control = this.fb.control(false); // Set initial value to false
      this.sourcingPurposeArray.push(control);
    }
    for (const item of this.supplierQualifications) {
      const control = this.fb.control(false); // Set initial value to false
      this.supplierQualificationsArray.push(control);
    }
  }

  // Updating Form
  updateForm() {
    if(this.buyerProfileDetails) {
    this.form.patchValue({
      purchasing_volume: this.buyerProfileDetails.annual_purchasing_volume,
      // sourcing_purpose: this.buyerProfileDetails.primary_sourcing_purpose, //array
      sourcing_frequency: this.buyerProfileDetails.average_sourcing_frequency,
      // preferred_industries: this.buyerProfileDetails.preferred_industries, //array
      // supplier_qualifications: this.buyerProfileDetails.preferred_supplier_qualifications, //array
    });
    }
  }

  // Calling when Submitting Data
  submit(formData: any) {
    const sourcing_purpose = (this.sourcingPurposeArray.value as Array<any>)
      .map((result, index) => {
        if (result) {
          return this.sourcingPurpose[index];
        }
      })
      .filter((value) => value !== undefined);

    const supplier_qualifications = (this.supplierQualificationsArray.value as Array<any>)
      .map((result, index) => {
        if (result) {
          return this.supplierQualifications[index];
        }
      })
      .filter((value) => value !== undefined);

    const buyerSourceData = formData.value;
    buyerSourceData.sourcing_purpose = sourcing_purpose;
    buyerSourceData.supplier_qualifications = supplier_qualifications;
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }

    buyerSourceData.user_id = this.userObj.buyerId;
    this.updateBuyerSourcingInformation(buyerSourceData);
  }

  // Sending data to API
  updateBuyerSourcingInformation(obj: any) {
    this.crud.updateBuyerSourcingInformation(obj).subscribe((res) => {
      if (res.status === 200) {
        this.toastr.success('Data submitted successfully');
        this.closeDialog();
      } else {
        this.toastr.error('Check Fields');
      }
    },err => {
      this.toastr.error('Internal Server Down');
    });
  }  

  // Closing the component
  closeDialog(): void {
    this.dialogRef.close();
  }
}


// not using