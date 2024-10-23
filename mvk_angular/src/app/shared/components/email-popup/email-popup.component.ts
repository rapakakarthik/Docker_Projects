import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../services/rfq.service';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-email-popup',
  templateUrl: './email-popup.component.html',
  styleUrls: ['./email-popup.component.scss']
})
export class EmailPopupComponent implements OnInit {
  myForm!: FormGroup;  
  
  constructor(
    public dialogRef: MatDialogRef<EmailPopupComponent>,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dataObject: any,
    private router: Router,
    private chatService: ChatService,
  ) {
    this.setForm();
  }
  ngOnInit(): void {
    this.setUserDetails();
  }

  setForm() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required]
    });
  }

  userObj: any;
  userMobile: number = 0;
  setUserDetails() {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userMobile = parseInt(this.userObj.mobile);
    }
  }

  get otp() {
    return this.myForm.controls['otp'];
  }
  get email() {
    return this.myForm.controls['email'];
  }

  otpStatus: boolean = false;
  signUpEmail: string = '';
  sendOtptoEmail() {
    this.signUpEmail = this.email.value;
    this.authenticationService.signUpOtpEmail(this.signUpEmail).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.otpStatus = true;
          this.toastr.success(res.message);
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
    });
  }

  verifyOtp: number = 0;
  signUP() {
    this.verifyOtp = Number(this.otp.value);
    this.authenticationService
      .updateEmail(this.signUpEmail, this.verifyOtp, this.userMobile)
      .subscribe({
        next: (res) => {
          if (res.status == 200) {
            this.userObj.email = this.signUpEmail;
            localStorage.setItem('userObj', JSON.stringify(this.userObj));
            this.signUpFireBase(this.signUpEmail, this.userMobile.toString());
            this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message)
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Server Down Try After some time')
        }
      });
  }

  signUpFireBase(email: string, password: string): void {
    this.chatService.createUserWithEmailAndPassword(email, password).then(() => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        // this.chatService.updateFirebaseToken(token);
        this.dialogRef.close();
      }).catch((err) => {
        console.log(err)
        this.dialogRef.close();
      });
    }).catch((err) => {
      this.chatService.signInWithEmailAndPassword(email, password).then((token) => {
        // this.chatService.updateFirebaseToken(token);
        this.dialogRef.close();
      });
      console.log(err);
      this.dialogRef.close();
    });
  }
  
  closeRFQpopup() {
    this.dialogRef.close();
  }
}
