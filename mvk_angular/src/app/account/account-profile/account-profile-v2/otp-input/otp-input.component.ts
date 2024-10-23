import { Component, ViewChildren, QueryList, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { timer, map, takeWhile, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss'
})
export class OtpInputComponent implements OnInit{


  constructor(
    private auth: AuthenticationService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public details: {email: string, mobile: number},
    public dialogRef: MatDialogRef<OtpInputComponent>
  ) {

  }
  ngOnInit(): void {
    this.showResend = false;
    this.redirectHome$.subscribe();
    console.log(this.details);
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

  submitOtp() {
    const otpString = this.otp.join('');
    console.log('OTP Entered: ', otpString);
    // Call your API with otpString
  }

  close() {
    this.dialogRef.close();
  }

  updateEmail() {
    const email = this.details.email;
    const mobile = this.details.mobile;
    const otpString = this.otp.join('');

    if (otpString.length === 4) {
      this.errorMessage = '';
      this.auth.updateEmail(email, otpString, mobile).subscribe({
        next: (value) => {
          if(value.status == 200) {
            this.dialogRef.close(email);
          } else {
            this.toastr.error(value.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.message);
        },
      })
    } else {
      this.errorMessage = 'Please enter a 4-digit OTP.';
    } 
  }

  showResend: boolean = false;
  resendOtp() {
    this.auth.signUpOtpEmail(this.details.email).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.showResend = false;
          this.redirectHome$.subscribe();
          for (let index = 0; index < this.otp.length; index++) {
            this.otp[index] = '';
          }
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

