import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, takeWhile, tap, timer } from 'rxjs';
import { PrivacyComponent } from 'src/app/custompages/privacy/privacy.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { TermsComponent } from 'src/app/custompages/terms/terms.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() emailValue = new EventEmitter();
  @Output() emitError = new EventEmitter();
  @Input('mobileNumber') signupMobileNum = 0;
  @Input('userName') userName = "";

  signUpEmail: string = '';
  verifyOtp: number = 0;
  showOtp: boolean = false;
  // isNumberValid: boolean = false;
  resendTimer: string = '';
  resendLimit: number = 10;
  isResending: boolean = false;
  hideSendotp: boolean = false;

  myForm!: FormGroup;
  defaultflag: any;
  @ViewChild('confirmation')
  confirmation!: TemplateRef<any>;
  otpStatus: boolean = false;

  selectedOption: any;
  dialogRef: any;
  verified: boolean = false;
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
    private fb: FormBuilder,
    private chatService: ChatService,
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    
  }

  createForm() {
    this.myForm = this.fb.group({
      // number: [''],
      otp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetForm() {
    this.myForm.reset();
  }

  // get numbermob() {
  //   return this.myForm.controls['number'];
  // }
  get otp() {
    return this.myForm.controls['otp'];
  }
  get email() {
    return this.myForm.controls['email'];
  }

  sendValueToSignup() {
    this.emailValue.emit(this.email.value)
  }

  checkBuyerAccountEmail() {
    this.signUpEmail = this.email.value;
    this.authenticationService.checkBuyerAccountEmail(this.signUpEmail).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (res.signup_step == 2) this.toastr.error(res.message);
          else this.sendOtptoEmail();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
    });
  }
  
  sendOtptoEmail() {
    // this.signUpEmail = this.email.value;
    this.authenticationService.signUpOtpEmail(this.signUpEmail).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          // this.isNumberValid = true;
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

  invalidOtp = false;
  verifyEmail() {
    this.emitError.emit(false);
    if(!this.userName) {
      this.emitError.emit(true);
      return;
    }
    this.invalidOtp = false;
    this.verifyOtp = Number(this.otp.value);
    this.authenticationService.createEmail(this.signUpEmail, this.verifyOtp, this.signupMobileNum, this.userName).subscribe((res) => {
      if (res.status == 200) {
        this.signUpFireBase(this.signUpEmail, this.signupMobileNum.toString());
        this.toastr.success(res.message);
        this.verified = true;
        this.next.emit();
      } else {
        this.invalidOtp = true;
        // this.toastr.error(res.message);
      }
    });
  }

  fcmToken: string ='';
  signUpFireBase(email: string, password: string): void {
    this.chatService.createUserWithEmailAndPassword(email, password).then(() => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        this.fcmToken = token;
        // this.chatService.updateFirebaseToken(token);
        console.log(token);
        if(this.dialogRef)
        this.dialogRef.close();
      });
    }).catch(() => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        this.fcmToken = token;
        // this.chatService.updateFirebaseToken(token);
        console.log(token);
        if(this.dialogRef)
        this.dialogRef.close();
      });
    });
  }

  resendOtp() {
    this.isResending = true;
    this.sendOtptoEmail();
  }

  notYou() {
    this.email.reset();
    this.otp.reset();
    this.invalidOtp = false;
    this.otpStatus = false;
    this.hideSendotp = false;
  }

  confirmationDailog(): void {
    this.dialogRef = this.dialog.open(this.confirmation, {
      width: '450px',
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
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
}

// 8074150026
