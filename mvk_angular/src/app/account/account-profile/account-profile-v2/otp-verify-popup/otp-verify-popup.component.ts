import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChildren, QueryList, ElementRef, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { timer, map, takeWhile, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-otp-verify-popup',
  templateUrl: './otp-verify-popup.component.html',
  styleUrl: './otp-verify-popup.component.scss'
})
export class OtpVerifyPopupComponent implements OnInit{


  constructor(
    private auth: AuthenticationService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public details: {mobile: string},
    public dialogRef: MatDialogRef<OtpVerifyPopupComponent>
  ) {

  }
  ngOnInit(): void {
    this.showResend = false;
    this.redirectHome$.subscribe();
  }
  
  otp: string[] = ['', '', '', ''];
  errorMessage: string = '';

  @ViewChildren('box0, box1, box2, box3') inputElements!: QueryList<ElementRef>;

  onInput(event: any, index: number) {
    const input = event.target.value;
    if (input.length === 1 && index < this.otp.length - 1) {
      const nextInput = this.inputElements.toArray()[index + 1].nativeElement;
      nextInput.focus();
    } else if (input.length === 1 && index === this.otp.length - 1) {
      event.target.blur();
    } else if(input.length === 0 && index === 0) {
      return;
    }
    else {
      const previousInput = this.inputElements.toArray()[index - 1].nativeElement;
      previousInput.focus();
    }
    this.otp[index] = input;
  }

  close() {
    this.dialogRef.close();
  }

  verifyForgetOtp() {
    const otpString = this.otp.join('');
    if (otpString.length === 4) {
      this.errorMessage = '';
      const obj = {
        mobile: this.details.mobile,
        otp: otpString
      }
      this.auth.verifyBuyerOtp(obj).subscribe({
        next: (value: any) => {
          if (value.status == 200) {
            this.dialogRef.close({otp: otpString});
          } else {
            this.toastr.error("Invalid OTP")
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error("Otp error: " + error)
          this.toastr.error("Invalid OTP");
        }
      })
    } else {
      this.errorMessage = 'Please enter a 4-digit OTP.';
    }  
  }


  showResend: boolean = false;
  resendOtp() {    
    this.auth.sendOtpToBuyer(this.details.mobile).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.showResend = false;
          this.otp = ['', '', '', '']
          this.redirectHome$.subscribe();
          this.toastr.success(value.message);
        }
        else {
          this.toastr.error(value.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    })
  }

  countDown$ = timer(0, 1000).pipe(
    map((value) => 30 - value),
    takeWhile((value) => value >= 0)
  );

  redirectHome$ = this.countDown$.pipe(
    tap((value) => {
      if (value <= 0) {
        this.showResend = true;
      }
    })
  );

}

