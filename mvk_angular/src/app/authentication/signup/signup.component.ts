import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import {ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from 'src/app/welcome-dialog/welcome-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  currentStep: number = 2;
  constructor(private auth: AuthenticationService, 
    private router: Router, private fb: FormBuilder, private route: ActivatedRoute, 
    private dialog: MatDialog,
    private toastr: ToastrService) { 
    this.createForm1();
    // this.createForm2();
  }
  ngOnInit(): void {
    if( this.auth.getToken()) {
      this.route.paramMap.subscribe(params => {
        this.currentStep = Number(params.get("stepId"));
      })
      if(this.currentStep == 2 || this.currentStep == 3) {
        this.currentSlide = this.currentStep;
      } else {
      this.router.navigate(['/products'])
      }
    }
    this.getSignUpSteps();
  }
  
  signupStepsData: any[] = [];
  getSignUpSteps() {
    this.auth.signupSteps().subscribe(res => {
      if (res.status == 200) this.signupStepsData = res.data
    })
  }


  currentSlide = 1;
  mobileNumber: number = 0;
  showNextSlide(mobile?: number): void {
    if (mobile) {
      this.mobileNumber = mobile;
    }

    if (this.currentSlide < 3) {
      this.currentSlide++;
    }
  }

  // single select options
  selectedOption: string = '';

  form1!: FormGroup;
  createForm1() {
    this.form1 = this.fb.group({
      school_name: ["", Validators.required],
      pincode: ["", Validators.required]
    })
  }

  get pincode() {
    return this.form1.get('pincode') as FormControl
  }
  get schoolName() {
    return this.form1.get('school_name') as FormControl
  }

  pinResponse: string = '';
  isPincodeValid: boolean = false;
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
          console.error('pincode error', err.message)
        }
      })
    }
  }

  // Not using
  submitStep1(value: any) {
    if(this.selectedOption == '') {
      this.toastr.error("Please fill all above fields");
      return;
    }
   const obj = {
    mobile: this.mobileNumber,
    school_name: value.school_name,
    pincode: value.pincode,
    institute_type: this.selectedOption,
    web_current_signup_step: 1,
    current_signup_step: 3
   }
   this.auth.signUpStep1(obj).subscribe({
    next:(value: any) => {
      if(value.status === 200) {
        this.selectedOption = "";
        console.log("success");
        this.showNextSlide();
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error("signup step 1 error", err.message)
    }
   })
  }

  submitStep3(value: any) {
    if(!this.isPincodeValid) {
      return;
    }
    const obj = {
      mobile: this.mobileNumber,
      school_name: value.school_name,
      pincode: value.pincode,
      type: "school-pincode",
      sigup_process_completed: 'true'
    }

    this.auth.newSignup(obj).subscribe({
      next:(value: any) => {
        if(value.status === 200) {
          let token = "";
          if(localStorage.getItem('temptoken')) {
            token = localStorage.getItem('temptoken') ?? "";
          }
          if(token) {
            this.auth.deleteToken();
            this.auth.setToken(token);
            localStorage.removeItem('temptoken');
          }
          this.setLoginDetails(value.data.user);
          this.toastr.success('User registered successfully');
          this.router.navigate(["/products"]);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("signup step 1 error", err.message)
      }
    })
  }

  // form2!: FormGroup;
  // createForm2() {
  //   this.form2 = this.fb.group({
  //     user_name: ["", Validators.required],
  //   })
  // }

  user_name = new FormControl();

  nameError(show: boolean) {
    this.nameRequired = show
  }

  isEmailValid: boolean = false;
  showEmail: boolean = true;
  emailUpdated() {
    this.showNextSlide();
    this.showEmail = false;
    this.isEmailValid = true;
  }

  showEmailError: boolean = false;
  nameRequired = false;

  // Not using
  showSelectedOptionError: boolean = false;
  submitStep2(value: any) {
    this.showEmailError = false;
    // this.showSelectedOptionError = false;
    // if(this.selectedOption == '') {
    //   this.showSelectedOptionError = true;
    //   return;
    // }
    if(!this.isEmailValid) {
      this.showEmailError = true;
      return;
    }
    const obj = {
     mobile: this.mobileNumber,
     owner_name: value.user_name,
     role: this.selectedOption,
     sigup_process_completed: 'true',
     web_current_signup_step: 2,
     current_signup_step: 6
    }
    // console.log(obj);
    this.auth.signUpStep2(obj).subscribe({
     next:(value: any) => {
       if(value.status === 200) {
        let token = "";
        if(localStorage.getItem('temptoken')) {
          token = localStorage.getItem('temptoken') ?? "";
        }
        if(token) {
          this.auth.deleteToken();
          this.auth.setToken(token);
          localStorage.removeItem('temptoken');
        }
        // if(value.data.token) {
        //   this.auth.deleteToken();
        //   this.auth.setToken(value.data.token);
        // }
         console.log("success");
          this.setLoginDetails(value.data.user);
          this.router.navigate(["/products"]);
        }
     },
     error: (err: HttpErrorResponse) => {
       console.error("signup step 2 error", err.message)
      }
    })
  }

  userObj = {
    email: '',
    mobile: 0,
    name: '',
    buyerId: 0,
    institueName: '',
    avatar: ''
  }

  setLoginDetails(res: any) {
    this.auth.deleteUserObj();
    this.userObj.email = res.mob_email ?? "";
    this.userObj.mobile = res.mob_user_phone ??  0;
    this.userObj.name = res.mob_first_name ?? "";
    this.userObj.buyerId = res.pk_mobile_user_id ?? 0
    this.userObj.institueName = res.mob_user_school_name ?? "";
    this.auth.setUserObj(JSON.stringify(this.userObj));
    this.openDeletePopup(res.mob_first_name);
  }

  welcomeDialogRef: any;
  openDeletePopup(name: string) {
    this.welcomeDialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '500px',
      disableClose: true,
      data: name
    });
    this.welcomeDialogRef.afterClosed().subscribe(() => {
      
    });
  }
}
