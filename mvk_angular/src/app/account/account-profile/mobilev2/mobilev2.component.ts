import { HttpErrorResponse } from '@angular/common/http';
import { Component,EventEmitter,Input,OnInit,Output } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {  map, takeWhile, tap, timer } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-mobilev2',
  templateUrl: './mobilev2.component.html',
  styleUrls: ['./mobilev2.component.scss']
})
export class Mobilev2Component implements OnInit {

  @Input('number') number!: number;
  @Input('showOtp') showOtp = true;
  @Output() next = new EventEmitter();

  constructor(
    private authenticationService: AuthenticationService,
    private rfq: RfqService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.setForm();
  }
  ngOnInit(): void {
    this.numbermob.setValue(this.number);
  }

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

  onPhoneNumberChange() {
   this.hideSendotp = this.numbermob.value == this.number
  }

  signupMobileNum: number = 0;
  otpLoading: boolean = false;
  checkBuyerAccount() {
    this.signupMobileNum = this.numbermob.value;
    let allowNums = ['6', '7', '8', '9'];
    let mobileStr = this.signupMobileNum.toString();
    if(!allowNums.includes(mobileStr.slice(0,1)) || mobileStr.length < 10) {
      this.toastr.error('Invalid Mobile Number');
      return;
    }
    this.otpLoading = true;
    this.authenticationService.checkBuyerAccount(this.signupMobileNum).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.otpLoading = false;
            if (res.signup_step == 2) this.toastr.success(res.message);
            else this.sendOtp();
          } else {
            this.toastr.error(res.message);
          } 
        },
        error: (err: HttpErrorResponse) => {
          console.error('error in signup check: ', err.message)
          this.otpLoading = false;
        } 
      });
  }

  isResending: boolean = false;
  hideSendotp: boolean = true;
  showOtpField: boolean = false;
  sendOtp() {
    this.authenticationService.signUpOtp(this.signupMobileNum).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.showOtpField = true;
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

  updateMobile() {
    const obj = {
      mobile: this.signupMobileNum,
      otp: this.otp.value as Number
    }
    this.rfq.updateUserMobile(obj).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log(res);
          this.next.emit();
        }
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Otp')
    })
  }

  resendOtp() {
    this.sendOtp();
  }

  notYou() {
    this.numbermob.reset();
    this.hideSendotp = false;
    this.showOtpField = false;
  }
}

