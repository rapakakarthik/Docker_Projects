import { HttpErrorResponse } from '@angular/common/http';
import { Component,EventEmitter,OnInit,Output,TemplateRef,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, takeWhile, tap, timer } from 'rxjs';
import { PrivacyComponent } from 'src/app/custompages/privacy/privacy.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { TermsComponent } from 'src/app/custompages/terms/terms.component';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
})
export class MobileComponent implements OnInit {
  @Output() next = new EventEmitter();

  signUpEmail: string = '';
  verifyOtp: number = 0;
  isNumberValid: boolean = false;
  isResending: boolean = false;
  hideSendotp: boolean = false;

  myForm!: FormGroup;
  @ViewChild('confirmation')
  confirmation!: TemplateRef<any>;
  otpStatus: boolean = false;
  images = [{ url: '../assets/images/india_flag.png', label: '91' }];
  selectedOption: any;
  dialogRef: any;
  onImageSelect(selectedImageUrl: MatSelectChange) {
    const imageElement = document.getElementById(
      'selected-image'
    ) as HTMLImageElement;
    imageElement.src = selectedImageUrl.value;
  }

  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.setForm();
  }
  ngOnInit(): void {
    this.selectedOption = this.images[0].url;
  }

  setForm() {
    this.myForm = this.fb.group({
      flag: [''],
      number: ['', Validators.required],
      otp: ['', [Validators.required]],
      // email: [''],
    });
  }
  
  get numbermob() {
    return this.myForm.controls['number'];
  }
  get otp() {
    return this.myForm.controls['otp'];
  }

  signupMobileNum: number = 0;
  otpLoading: boolean = false;
  userExists = true;
  sendOTP() {
    this.signupMobileNum = this.numbermob.value;
    let allowNums = ['6', '7', '8', '9'];
    let mobileStr = this.signupMobileNum.toString();
    if(!allowNums.includes(mobileStr.slice(0,1)) || mobileStr.length < 10) {
      this.toastr.error('Invalid Mobile Number');
      return;
    }
    this.numbermob.setErrors(null)
    this.otpLoading = true;
    this.isNumberValid = true;
    this.authenticationService.checkBuyerAccount(this.signupMobileNum).subscribe({
        next: (res: any) => {
          this.otpLoading = false;
          if (res.status == 200) {
            if (res.signup_step == 2) {
              this.numbermob.setErrors({'alreadyExists': true})
              this.userExists = true;   
            }
            // if (res.signup_step == 2) this.confirmationDailog();
            else this.signUpMethod();
          } else this.toastr.error(res.message);
        },
        error: (err: HttpErrorResponse) => {
          console.error('error in signup check: ', err.message)
          this.otpLoading = false;
        } 
      });
  }

  confirmationDailog(): void {
    this.dialogRef = this.dialog.open(this.confirmation, {
      width: '450px',
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
  }

  signUpMethod() {
    this.authenticationService.signUpOtp(this.signupMobileNum).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.otpStatus = true;
          this.hideSendotp = true;
          this.isResending = false;
          this.redirectHome$.subscribe();
          this.toastr.success(res.message);
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Mobile Number')
    });
  }

  countDown$ = timer(0, 1000).pipe(
    map((value) => 30 - value),
    takeWhile((value) => value >= 0),
  );

  redirectHome$ = this.countDown$.pipe(
    tap((value) => {
      if (value <= 0) {
        this.isResending = true;
      }
    })
  );

  otpLoading2: boolean = false;
  invalidOtp = false;
  verified = false;
  signUP() {
    this.otpLoading2 = true;
    this.invalidOtp = false;
    this.verifyOtp = Number(this.otp.value);
    this.authenticationService.createAccount(this.signupMobileNum, this.verifyOtp).subscribe({
      next: (res) => {
        this.otpLoading2 = false;
        if (res.status == 200) {
          this.verified = true;
          if(res.data.token) {
            localStorage.setItem('temptoken', res.data.token);
            // this.authenticationService.deleteToken();
            // this.authenticationService.setToken(res.data.token);
            // this.setLoginDetails(res.data.user);
          }
          this.toastr.success(res.message);
          // this.next.emit(this.signupMobileNum);
        } else {
          // this.toastr.error(res.message);
          this.invalidOtp = true;
          this.verified = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.otpLoading2 = false;
        this.toastr.error(err.message);
      }
    });
  }

  continue() {
    if(this.verified) {
      this.next.emit(this.signupMobileNum);
    }
  }

  userObj = {
    mobile: 0,
    buyerId: 0,
  }

  setLoginDetails(res: any) {
    this.authenticationService.deleteUserObj();
    this.userObj.mobile = res.mob_user_phone ??  0;
    this.userObj.buyerId = res.pk_mobile_user_id ?? 0
    this.authenticationService.setUserObj(JSON.stringify(this.userObj))
  }


  // sendOtptoEmail() {
  //   this.signUpEmail = this.email.value;
  //   this.authenticationService.signUpOtpEmail(this.signUpEmail).subscribe(
  //     (res) => {
  //       if (res.status == 200) {
  //         this.isNumberValid = true;
  //         this.toastr.success(res.message);
  //       } else this.toastr.error(res.message);
  //     },
  //     (err) => this.toastr.warning('Invalid Email')
  //   );
  // }


  resendOtp() {
    // this.isResending = false;
    this.signUpMethod();
    // else this.sendOtptoEmail();
  }

  notYou() {
    this.isNumberValid = false;
    this.hideSendotp = false;
    this.otpStatus = false;
    this.invalidOtp = false;
    this.myForm.reset()
  }

  gotosignin() {
    this.router.navigateByUrl('/signin');
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close();
  }

  privacypopup() {
    this.dialogRef = this.dialog.open(PrivacyComponent, {
      width: '750px',
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
  }
  termspopup() {
    this.dialogRef = this.dialog.open(TermsComponent, {
      width: '750px',
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
  }

  limitCharacters(event: any) {
    let value: string = event.target.value;
    if(value.length > 10) {
      value = value.substring(0, 10);
    }
    this.myForm.patchValue({number: value})
  }
}