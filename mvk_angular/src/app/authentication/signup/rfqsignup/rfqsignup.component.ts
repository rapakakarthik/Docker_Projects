import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WelcomeDialogComponent } from 'src/app/welcome-dialog/welcome-dialog.component';

@Component({
  selector: 'app-rfqsignup',
  templateUrl: './rfqsignup.component.html',
  styleUrl: './rfqsignup.component.scss'
})
export class RfqsignupComponent implements OnInit {
  
  mobileNumber: number = 0;
  token: string = '';
  
  constructor(
    private auth: AuthenticationService, 
    private router: Router, 
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<RfqsignupComponent>,
    @Inject(MAT_DIALOG_DATA) public signInData: {mobile: number, token: string},
    private dialog: MatDialog
    ) { 
    this.createForm1();
  }
  ngOnInit(): void {
    this.getSignUpSteps();
    if(this.signInData) {
      this.mobileNumber = this.signInData.mobile;
      this.token = this.signInData.token;
    }
  }
  
  signupStepsData: any[] = [];
  private getSignUpSteps() {
    this.auth.signupSteps().subscribe(res => {
      if (res.status == 200) this.signupStepsData = res.data
    })
  }

  currentSlide = 2;
  showNextSlide(): void {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    }
  }

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
          if(this.token) {
            this.auth.deleteToken();
            this.auth.setToken(this.token);
            localStorage.removeItem('r-mobile');
            localStorage.removeItem('r-token');
          }
          this.setLoginDetails(value.data.user);
          this.router.navigateByUrl(`/account/viewdetails?rfq=all`)
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("signup step 1 error", err.message)
      }
    })
  }

  user_name = new FormControl();
  nameError(show: boolean) {
    this.nameRequired = show
  }

  isEmailValid: boolean = false;
  showEmail = true;
  emailUpdated() {
    this.showNextSlide();
    this.showEmail = false;
    this.isEmailValid = true;
  }

  showEmailError: boolean = false;
  nameRequired = false;
  

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
    this.auth.setUserObj(JSON.stringify(this.userObj));
    this.openDeletePopup(res.mob_first_name);
    this.close();
  }

  closeSignupDialog() {
    // this.actionclose.emit();
  }

  close():void {
    this.dialogRef.close();
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

