import { HttpErrorResponse } from '@angular/common/http';
import { Component,EventEmitter,OnInit,Output, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, takeWhile, tap, timer } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-confirm-mobile',
  templateUrl: './confirm-mobile.component.html',
  styleUrl: './confirm-mobile.component.scss'
})
export class ConfirmMobileComponent implements OnInit {
  @Output() next = new EventEmitter();

  isNumberValid: boolean = false;
  isResending: boolean = false;
  hideSendotp: boolean = false;

  otpStatus: boolean = false;

  // Injectables
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private authenticationService = inject(AuthenticationService);
  
  constructor(public dialog: MatDialog) {
    this.setForm();
  }
  ngOnInit(): void {}

  myForm!: FormGroup;
  setForm() {
    this.myForm = this.fb.group({
      number: ['', Validators.required],
      otp: ['', [Validators.required]],
    });
  }
  
  get numbermob() {
    return this.myForm.controls['number'];
  }
  get otp() {
    return this.myForm.controls['otp'];
  }

  signupMobileNum: number = 0;
  mobileError = false;
  errorTxt = '';
  sendOTP() {
    this.mobileError = false;
    this.otpLoading = true;
    this.signupMobileNum = this.numbermob.value;
    this.isNumberValid = true;
    this.authenticationService.sendOtp(this.signupMobileNum).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.status == 200) {
          this.otpStatus = true;
          this.hideSendotp = true;
          this.isResending = false;
          this.redirectHome$.subscribe();
          this.toastr.success(res.message);
        } else {
          // this.toastr.error(res.message);
          this.errorTxt = res.message;
          this.mobileError = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.otpLoading = false;
        this.toastr.error('Invalid Mobile Number');
      }
    });
  }


  otpLoading: boolean = false;
  invalidOtp = false;
  verified = false;
  verifyOtp() {
    this.otpLoading = true;
    this.invalidOtp = false;
    const data = {
      mobile: this.signupMobileNum,
      otp: this.otp.value
    }
    this.authenticationService.verifyBuyerOtp(data).subscribe({
      next: (res) => {
        this.otpLoading = false;
        if (res.status == 200) {
          this.verified = true;
          this.next.emit(this.signupMobileNum);
          // if(res.data.token) {
          //   // localStorage.setItem('temptoken', res.data.token);
          // }
          this.toastr.success(res.message);
        } else {
          // this.toastr.error(res.message);
          this.invalidOtp = true;
          this.verified = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.otpLoading = false;
        this.toastr.error(err.message);
      }
    });
  }

  continue() {
    if(this.verified) {
      this.next.emit(this.signupMobileNum);
    }
  }

  resendOtp() {
    this.sendOTP();
  }

  notYou() {
    this.numbermob.reset();
    this.isNumberValid = false;
    this.hideSendotp = false;
    this.otpStatus = false;
  }


  // Timer Function Starts
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
  // Timer Function Ends
}

