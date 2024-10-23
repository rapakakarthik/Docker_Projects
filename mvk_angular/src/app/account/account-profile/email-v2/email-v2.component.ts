import { HttpErrorResponse } from '@angular/common/http';
import {Component,EventEmitter,Input,OnInit, Output,} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {  map, takeWhile, tap, timer } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-email-v2',
  templateUrl: './email-v2.component.html',
  styleUrls: ['./email-v2.component.scss']
})
export class EmailV2Component implements OnInit {
  @Input('mobileNumber') signupMobileNum = 0;
  @Input('email') currentEmail = 0;
  @Output() next = new EventEmitter();

  isResending: boolean = false;
  hide: boolean = false;
  numberLogin: boolean = true;
  otpStatus: boolean = false;
  verified: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private chatService: ChatService,
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.email.setValue(this.currentEmail);
  }

  myForm!: FormGroup;
  createForm() {
    this.myForm = this.fb.group({
      otp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetForm() {
    this.myForm.reset();
  }

  get otp() {
    return this.myForm.controls['otp'];
  }
  get email() {
    return this.myForm.controls['email'];
  }

  onPhoneNumberChange() {
    this.hideSendotp = this.email.value == this.currentEmail
   }

  signUpEmail: string = '';
  checkBuyerAccountEmail() {
    this.signUpEmail = this.email.value;
    this.authenticationService.checkBuyerAccountEmail(this.signUpEmail).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (res.signup_step == 2) this.toastr.success(res.message);
          else this.sendOtptoEmail();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
    });
  }
  
  hideSendotp: boolean = true;
  sendOtptoEmail() {
    this.authenticationService.signUpOtpEmail(this.signUpEmail).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.hideSendotp = true;  
          this.isResending = false;
          this.otpStatus = true;
          this.redirectHome$.subscribe();
          this.toastr.success(res.message);
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
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

  signupBtn() {
    this.myForm.reset();
  }

  verifyOtp: number = 0;
  signUP() {
    this.verifyOtp = Number(this.otp.value);
    this.authenticationService.updateEmail(this.signUpEmail, this.verifyOtp, this.signupMobileNum).subscribe((res) => {
      if (res.status == 200) {
        this.signUpFireBase(this.signUpEmail, this.signupMobileNum.toString());
        this.toastr.success(res.message);
        this.verified = true;
        this.next.emit();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  fcmToken: string ='';
  signUpFireBase(email: string, password: string): void {
    this.chatService.createUserWithEmailAndPassword(email, password).then(() => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        this.fcmToken = token;
        console.log(token);
      });
    }).catch(() => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        this.fcmToken = token;
        console.log(token);
      });
    });
  }

  resendOtp() {
    this.isResending = true;
    this.sendOtptoEmail();
  }

  notYou() {
    this.email.reset();
    this.numberLogin = true;
    this.otpStatus = false;
    this.hide = false;
    this.hideSendotp = false;
  }
}

// 8074150026

