import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-signup-v2',
  templateUrl: './signup-v2.component.html',
  styleUrls: ['./signup-v2.component.scss']
})
export class SignupV2Component implements OnInit{

  signupForm!: FormGroup
  @Input('mobileNumber')
  mobileNumber = 0;

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router, private toastr: ToastrService) {
    this.createSignupV2Form();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createSignupV2Form() {
    this.signupForm = this.fb.group({
      schoolName: [''],
      pincode: [''],
      ownerName: [''],
      // gender: ['', Validators.required]
    })
  }

  showEmail: boolean = true;
  hideEmail() {
    this.showEmail = false;
    this.showEmailError = false;
  }

  showEmailError: boolean = false;
  updateEmailStatus(email: string) {
    if(email) {
      this.showEmailError = true;
    } else {
      this.showEmailError = false;
      console.log("no email")
    }
  }

  updateDetails(value: any) {
    if(this.showEmailError) {
      this.toastr.error("Verify email first");
    } else {
      if(this.pincode.value && !this.isPincodeValid) {
        this.toastr.error("Enter Valid Pincode");
      } else {
        const obj = {
          mobile: this.mobileNumber,
          sigup_process_completed: true,
          school_name: value.schoolName,
          pincode: value.pincode,
          owner_name: value.ownerName,
          // gender: value.gender,
        }
        // console.log(obj);
        this.updateBuyerDetailsV2(obj);
      }
    }
  }

  skipDetails() {
    const obj = {
      mobile: this.mobileNumber,
      sigup_process_completed: true,
    }
    this.updateBuyerDetailsV2(obj);
  }

  updateBuyerDetailsV2(obj: any) {
    this.auth.updateBuyerDetailsV2(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          console.log(res);
          this.router.navigate(['/products']);
        } else {
          alert(res.message);
          this.toastr.warning(res.message)
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message)
        console.error('dropdown error', err.message)
      }
    })
  }

  get pincode() {
    return this.signupForm.get('pincode') as FormControl
  }

  pinResponse: string = '';
  isPincodeValid: boolean = false;
  showPincode: boolean = false;
  pincodeVerify() {
    if(this.pincode.valid) {
      this.isPincodeValid = false;
      this.auth.pincodeVerify(this.pincode.value).subscribe({
        next: (res: any) => {
          this.showPincode = true;
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


// not using