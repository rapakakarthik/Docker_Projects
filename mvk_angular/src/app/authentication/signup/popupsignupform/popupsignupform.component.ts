import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-popupsignupform',
  templateUrl: './popupsignupform.component.html',
  styleUrls: ['./popupsignupform.component.scss']
})
export class PopupsignupformComponent implements OnInit {
  
  @Input() signInData: any;
  @Output() actionclose = new EventEmitter()


  
  constructor(
    private auth: AuthenticationService, 
    private router: Router, 
    private fb: FormBuilder, 
    ) { 
    this.createForm1();
    this.createForm2();
  }
  ngOnInit(): void {
    this.getSignUpSteps();
    if(this.signInData) {
      this.mobileNumber = this.signInData.mob_user_phone;
      this.token = this.signInData.token;
      if(this.signInData.current_signup_step < 3) {
        this.selectedOption = this.signInData.institute_type ?? '';
        this.schoolName.patchValue(this.signInData.mob_user_school_name ?? "")
        this.pincode.patchValue(this.signInData.user_pincode ?? "")
        this.currentSlide = 2;
      } else {
        this.currentSlide = 3;
        console.log(this.signInData);
        if(this.signInData.mob_email) {
          this.showEmail = false;
          this.isEmailValid = true;
        }
        this.userName.patchValue(this.signInData.mob_first_name ?? "")
        this.selectedOption = this.signInData.mob_user_designation ?? '';
      }
    }
  }
  
  signupStepsData: any[] = [];
  private getSignUpSteps() {
    this.auth.signupSteps().subscribe(res => {
      if (res.status == 200) this.signupStepsData = res.data
    })
  }


  currentSlide = 2;
  mobileNumber: number = 0;
  token: string = '';
  showNextSlide(mobile?: number): void {
    // if (mobile) {
    //   this.mobileNumber = mobile;
    // }

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
          else {
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

  submitStep1(value: any) {
    if(this.selectedOption == '') {
      this.showSelectedOptionError = true;
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
        this.showSelectedOptionError = false;
        console.log("success");
        this.showNextSlide();
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error("signup step 1 error", err.message)
    }
   })
  }

  form2!: FormGroup;
  createForm2() {
    this.form2 = this.fb.group({
      user_name: ["", Validators.required],
    })
  }

  get userName() {
    return this.form1.get('user_name') as FormControl
  }

  isEmailValid: boolean = false;
  showEmail = true;
  emailUpdated() {
    this.showEmail = false;
    this.isEmailValid = true;
  }

  showEmailError: boolean = false;
  showSelectedOptionError: boolean = false;
  submitStep2(value: any) {
    this.showEmailError = false;
    this.showSelectedOptionError = false;
    if(this.selectedOption == '') {
      this.showSelectedOptionError = true;
      return;
    }
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
        if(this.token) {
          this.auth.deleteToken();
          this.auth.setToken(this.token);
        }
        this.setLoginDetails(value.data.user);
        let object = {
          isSignIn: true
        }
        this.actionclose.emit(object);
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
    // this.signInFireBase(user.mob_email, user.mob_user_phone);
    this.auth.deleteUserObj();
    this.userObj.email = res.mob_email ?? "";
    this.userObj.mobile = res.mob_user_phone ??  0;
    this.userObj.name = res.mob_first_name ?? "";
    this.userObj.buyerId = res.pk_mobile_user_id ?? 0
    this.userObj.institueName = res.mob_user_school_name ?? "";
    this.auth.setUserObj(JSON.stringify(this.userObj))
  }

  closeSignupDialog() {
    this.actionclose.emit();
  }
}

