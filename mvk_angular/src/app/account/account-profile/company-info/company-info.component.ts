import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
})
export class CompanyInfoComponent implements OnInit {
  
  form!: FormGroup;
  userObj: any;
  dropdowns: any;
  same_as_address: boolean = false;
  formControls: any[] = [];

  businessType: String[] = [];
  platforms: String[] = [];
  totalEmployess: String[] = [];
  selectedFile: any;
  salutation: {key: string, value: number}[] = [{key: "Mr", value: 1}, {key: "Mrs", value: 2}, {key: "Ms", value: 3}]
  purchasingVolume: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<CompanyInfoComponent>,
    private toaster: ToastrService,
    private crud: CrudService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public buyerProfileDetails: any
  ) {
    this.createContactForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Creating Form
  createContactForm() {
    this.form = this.fb.group({
      company_name: ['', Validators.required],
      brand_name: ['', Validators.required],
      primary_email: ['', Validators.required],
      primary_mobile: ['', Validators.required],
      about_us: ['', Validators.required],
      year: ['', Validators.required],
      owner_salutation: ['', Validators.required],
      owner_surname: ['', Validators.required],
      owner_name: ['', Validators.required],
      legal_status: ['', Validators.required],
      total_employess: ['', Validators.required],
      annual_turnover: ['', Validators.required],
      website: ['', Validators.required],
      alternative_mobile: ['', Validators.required],
      alternative_email: ['', Validators.required],
      landline_no: ['', Validators.required],
      alternative_landline: ['', Validators.required],
      fax_no: ['', Validators.required],
      alternative_fax_no: ['', Validators.required],
      business_type: this.fb.array([]),
      country_name: ['', Validators.required],
      state_name: ['', Validators.required],
      city_name: ['', Validators.required],
      street: ['', Validators.required],
      landmark: ['', Validators.required],
      pincode: ['', Validators.required],
      same_as_address: [''],
      op_country: [''],
      op_state: [''],
      op_city: [''],
      op_street: [''],
      platform: this.fb.array([]),
      main_products1: ['', Validators.required],
      main_products2: [''],
      main_products3: [''],
      main_products4: [''],
      main_products5: [''],
    });
    this.getBuyerUpdateProfileDropdown();
  }

  // Getting Dynamic Fields
  getBuyerUpdateProfileDropdown() {
    this.crud.getBuyerUpdateProfileDropdown().subscribe((res) => {
      if (res.status === 200) {
        this.dropdowns = res.dropdowns;
        this.businessType = this.dropdowns.business_type;
        this.platforms = this.dropdowns.platforms;
        this.totalEmployess = this.dropdowns.total_employess;
        this.purchasingVolume = this.dropdowns.annual_purchasing_volume;
        this.addCheckboxes();
      }
    });
  }

  get businessTypeArray() {
    return this.form.get('business_type') as FormArray;
  }
  get platformArray() {
    return this.form.get('platform') as FormArray;
  }

  // Adding Fields Dynamically
  addCheckboxes() {
    for (const item of this.businessType) {
      const control = this.fb.control(false); // Set initial value to false
      this.businessTypeArray.push(control);
    }
    for (const item of this.platforms) {
      const control = this.fb.control(false); // Set initial value to false
      this.platformArray.push(control);
    }
  }
  

  
  // Updating Form
  updateForm() {
    if(this.buyerProfileDetails) {
    this.form.patchValue({
      company_name: this.buyerProfileDetails.company_name,
      brand_name: this.buyerProfileDetails.brand_name,
      primary_email: this.buyerProfileDetails.primary_email,
      primary_mobile: this.buyerProfileDetails.primary_mobile,
      about_us: this.buyerProfileDetails.about_us,
      year: this.buyerProfileDetails.year_established,
      owner_salutation: this.buyerProfileDetails.owner_salutation,
      owner_surname: this.buyerProfileDetails.owner_surname,
      owner_name: this.buyerProfileDetails.owner_name,
      legal_status: this.buyerProfileDetails.legal_status,
      // total_employess: this.buyerProfileDetails.total_employess,
      total_employess: this.buyerProfileDetails.employee_size,
      annual_turnover: this.buyerProfileDetails.annual_turnover,
      website: this.buyerProfileDetails.company_website,
      alternative_mobile: this.buyerProfileDetails.alternative_mobile,
      alternative_email: this.buyerProfileDetails.alternative_email,
      landline_no: this.buyerProfileDetails.landline_no,
      alternative_landline: this.buyerProfileDetails.alternative_landline,
      fax_no: this.buyerProfileDetails.fax_no,
      alternative_fax_no: this.buyerProfileDetails.alternative_fax_no,
      //  business_type: this.buyerProfileDetails.business_type,
      country_name: this.buyerProfileDetails.country_name,
      state_name: this.buyerProfileDetails.state_name,
      city_name: this.buyerProfileDetails.city_name,
      street: this.buyerProfileDetails.street,
      landmark: this.buyerProfileDetails.street,
      pincode: this.buyerProfileDetails.street,
      // same_as_address: this.buyerProfileDetails.same_as_address,
      op_country: this.buyerProfileDetails.op_country,
      op_state: this.buyerProfileDetails.op_state,
      op_city: this.buyerProfileDetails.op_city,
      op_street: this.buyerProfileDetails.op_street,
      // platform: this.buyerProfileDetails.platforms,
    });    
    if(this.buyerProfileDetails.main_products != null) {
      this.form.patchValue({
        main_products1: this.buyerProfileDetails.main_products[0],
        main_products2: this.buyerProfileDetails.main_products[1],
        main_products3: this.buyerProfileDetails.main_products[2],
        main_products4: this.buyerProfileDetails.main_products[3],
        main_products5: this.buyerProfileDetails.main_products[4],
      })
    }
    if(this.buyerProfileDetails.platforms != null) {
      this.platforms.forEach((key, index) => {
        if((this.buyerProfileDetails.platforms as Array<String>).includes(key)) {
          this.platformArray.at(index).patchValue(true)
        }
      })
    }
    if(this.buyerProfileDetails.business_type != null) {
      this.businessType.forEach((key, index) => {
        if((this.buyerProfileDetails.business_type as Array<String>).includes(key)) {
          this.businessTypeArray.at(index).patchValue(true)
        }
      })
    }}
  }

  // Calling upon clicked the Submit Data
  submit(formData: any) {
    const business_type = (this.businessTypeArray.value as Array<any>)
    .map((result, index) => {
      if (result) {
        return this.businessType[index];
      }
      return
    })
    .filter((value) => value !== undefined);

    const platform = (this.platformArray.value as Array<any>)
    .map((result, index) => {
      if (result) {
        return this.platforms[index];
      }
      return
    })
    .filter((value) => value !== undefined);
    
    const buyerCompanyData = formData.value;
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }

    if (buyerCompanyData.business_type) {
      for (let key in buyerCompanyData.business_type) {
        if (buyerCompanyData.business_type[key] === true) {
          this.formControls.push(key);
        }
      }
    }


    
    const data:{ [key: string]: any } = {
      company_name: buyerCompanyData.company_name,
      company_logo: this.selectedFile,
      brand_name: buyerCompanyData.brand_name,
      primary_email: buyerCompanyData.primary_email,
      primary_mobile: buyerCompanyData.primary_mobile,
      about_us: buyerCompanyData.about_us,
      year: buyerCompanyData.year,
      owner_salutation:  buyerCompanyData.owner_salutation,
      owner_surname:  buyerCompanyData.owner_surname,
      owner_name:  buyerCompanyData.owner_name,
      legal_status:  buyerCompanyData.legal_status,
      total_employess: buyerCompanyData.total_employess,
      annual_turnover:  buyerCompanyData.annual_turnover,
      website: buyerCompanyData.website,
      alternative_mobile:  buyerCompanyData.alternative_mobile,
      alternative_email:  buyerCompanyData.alternative_email,
      landline_no:  buyerCompanyData.landline_no,
      alternative_landline:  buyerCompanyData.alternative_landline,
      fax_no:  buyerCompanyData.fax_no,
      alternative_fax_no:  buyerCompanyData.alternative_fax_no,
      business_type: business_type, //
      country_name: buyerCompanyData.country_name,
      state_name: buyerCompanyData.state_name,
      city_name: buyerCompanyData.city_name,
      street: buyerCompanyData.street,
      landmark:  buyerCompanyData.landmark,
      pincode:  buyerCompanyData.pincode,
      same_as_address: buyerCompanyData.same_as_address ? 1 : 0,
      op_country: buyerCompanyData.op_country,
      op_state: buyerCompanyData.op_state,
      op_city: buyerCompanyData.op_city,
      op_street: buyerCompanyData.op_street,
      platforms: platform, //
      main_products: [
        buyerCompanyData.main_products1,
        buyerCompanyData.main_products2,
        buyerCompanyData.main_products3,
        buyerCompanyData.main_products4,
        buyerCompanyData.main_products5,
      ],
      user_id: this.userObj.buyerId,
    };

    const submitData = new FormData();
    // for (const key in data) {
    //   if (Object.prototype.hasOwnProperty.call(data, key)) {
    //     submitData.append(key, JSON.stringify(data[key]));
    //   }
    // }
    const d: any = ['this.selectedFile'];
    submitData.append('company_logo', this.selectedFile);
    submitData.append('hello', d);
    submitData.forEach(res => {
      console.log(res);
    })
    // console.log(submitData);
    // this.updateBuyerCompanyInformation(data);
  }

  // Sending Data to API
  updateBuyerCompanyInformation(obj: any) {
    this.crud.updateBuyerCompanyInformation(obj).subscribe(value => {
      if (value.status === 200) {
        this.toaster.success(value.message);
        this.closeDialog();
      } else {
        this.toaster.error(value.message);
      }
    },error => {
      this.toaster.error("Internal Server Problem");
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}


// not using