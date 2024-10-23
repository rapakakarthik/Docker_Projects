import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit {
  form!: FormGroup;
  userObj: any; 

  constructor(
    private crud: CrudService,
    private rfq: RfqService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public buyerProfileDetails: any,
    public dialogRef: MatDialogRef<ContactInfoComponent>
  ) {
    this.createContactForm();
  }
  ngOnInit(): void {
    this.getDropDowns();
    this.updateForm();
    console.log(this.buyerProfileDetails)
  }

  // Creating Form
  createContactForm() {
    this.form = this.fb.group({
      school_name: [''],
      management_type: [''],
      seniority_level: [''],
      designation: [''],
      pincode: [''],
      address: [''],
    });
  }

  managements: any[] = [];
  seniorities: any[] = [];
  designations: any[] = [];
  getDropDowns() {
    this.rfq.getDropDowns().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.managements = res.data.management_types[0].children;
          this.seniorities = res.data.seniority_level;
          // this.designations = res.data.pre_salutations;
          this.designations = res.data.designations;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('dropdown error', err.message)
      }
    });
  }

  // Updating Form
  updateForm() {
    if (this.buyerProfileDetails) {
      this.form.patchValue({
        school_name: this.buyerProfileDetails.mob_user_school_name,
        management_type: this.buyerProfileDetails.management_type_id,
        seniority_level: this.buyerProfileDetails.mob_seniority_level,
        designation: Number(this.buyerProfileDetails.mob_user_designation),
        pincode: this.buyerProfileDetails.user_pincode,
        address: this.buyerProfileDetails.user_address?.user_address_line1,
      });
    }
  }

  // When Clicked on Update Details Button
  submit(formData: any) {
    const buyerCompanyData = formData.value;
    // if (localStorage.getItem('userObj')) {
    //   this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    // }
    const submitData = {
      school_name: buyerCompanyData.school_name,
      management_type: buyerCompanyData.management_type,
      seniority_level: buyerCompanyData.seniority_level,
      designation: buyerCompanyData.designation,
      user_pincode: buyerCompanyData.pincode,
      user_address: buyerCompanyData.address,
    };    
    this.updateUserProessionalDetails(submitData);
  }

  // Sending Data To API
  updateUserProessionalDetails(obj: any) {
    this.rfq.updateUserProessionalDetails(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
        this.closeDialog();
          console.log(res);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('dropdown error', err.message)
      }
    })
  }

  // When Cliked on Submit
  submitV2(formData: any) {
    const buyerContactData = formData.value;
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }
    buyerContactData.user_id = this.userObj.buyerId;
    buyerContactData.mobile = this.buyerProfileDetails.mobile;
  }

  // Sending data to API
  updateBuyerContactInformation(obj: any) {
    this.crud.updateBuyerContactInformation(obj).subscribe((res) => {  // not using
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

  get pincode() {
    return this.form.get('pincode') as FormControl
  }

  pinResponse: string = '';
  isPincodeValid: boolean = true;
  pincodeVerify() {
    if(this.pincode.valid) {
      this.pinResponse = "";
      this.isPincodeValid = false;
      this.auth.pincodeVerify(this.pincode.value).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.isPincodeValid = true;
            this.pinResponse = res.data
          }
          if(res.status === 400) {
            this.isPincodeValid = false;
            this.pinResponse = res.message
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('dropdown error', err.message)
        }
      })
    }
    
  }
}
