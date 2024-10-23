import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { MatSelectChange } from '@angular/material/select';
import { ChatService } from 'src/app/shared/services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupsigninformComponent } from '../popupsigninform/popupsigninform.component';
import { timer, map, takeWhile, tap, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DeletePopupConfirmComponent } from 'src/app/shared/components/delete-popup-confirm/delete-popup-confirm.component';

@Component({
  selector: 'app-signinform',
  templateUrl: './signinform.component.html',
  styleUrls: ['./signinform.component.scss']
})
export class SigninformComponent implements OnInit {
  label: string = 'Mobile No'
  otpSent: boolean = false
  otpValid: boolean = false
  isOtpDisabled: boolean = false
  showLogin: boolean = false
  isSigninButton: boolean = true;
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  isForgotPassword: boolean = false;
  newPasshide: boolean = true;
  confirmPasshide: boolean = true;
  otpTimer: string = '';
  resendEnable: boolean = false;
  motp: boolean = true;
  mpwd: boolean = false;
  eotp: boolean = false;
  epwd: boolean = false;
  otpText: string = 'Sign In With Password';
  otpTextnew: string = ' Sign In With OTP'
  onlymobile: boolean = true

  @Input() popDisplay: boolean = false;
  @Output() actionclose = new EventEmitter()
  forgotPasswordDetails = {
    mobile: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  }
  userObj = {
    email: '',
    mobile: 0,
    userId: 0,
    name: '',
    buyerId: 0,
    institueName: '',
    avatar: '',
    assignee: {}
  }
  msg: any;

  images = [{ url: '../assets/images/india_flag.png', label: '91' }];
  selectedOption: any;

  onImageSelect(selectedImageUrl: MatSelectChange, img: HTMLImageElement) {
    img.src = selectedImageUrl.value;
  }
  constructor(private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private socialService: SocialAuthService,
    private auth: AngularFireAuth,
    private chatService: ChatService,
    private rfq: RfqService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const password = params.get('reset');
      if(password == 'password') {
        this.createForgotForm();
        this.isForgotPassword = true;
      }
      const returnTo = params.get('return_to');
      if(returnTo) {
        this.isRedirected = true;
        this.redirectionUrl = returnTo;
      }
    })
    this.selectedOption = this.images[0].url;

    // this.getSocialDetails();
    this.showSocialLogin();
    this.createLoginForm();
  }

  private getSocialDetails() {
    this.socialService.authState.subscribe((user) => {
      this.authenticationService.loginWithSocial(user.email, 'google').subscribe((res: any) => {
        if (res.status == 200) {
          this.redirection();
        }
        this.msg = res.message;
      });
    });
  }

  socialLogins: any[] = [];
  private showSocialLogin() {
    this.authenticationService.getSocialLogins().subscribe({
      next: (value: any) => {
        this.socialLogins = value.data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message);
      }
    })
  }

  private createLoginForm(): void {
    this.loginForm = new FormGroup({
      mob_email: new FormControl('', Validators.required),
      otp: new FormControl('', Validators.required),
    })
  }

  get otp() {
    return this.loginForm.get('otp') as FormControl;
  }

  get mobEmail() {
    return this.loginForm.get('mob_email') as FormControl;
  }

  createForgotForm(): void {
    this.forgotForm = new FormGroup({
      mobile: new FormControl('', [Validators.required]),
      otp: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    })
  }

  validPassword = true;
  get newPassword() {
    return this.forgotForm.get('newPassword')
  }

  swithtotab(e: any) {
    // this.newPassword?.hasError('')
    if (e == 'email') {
      this.loginForm.get('mob_email')?.setValue('');
      this.loginForm.addControl('password', new FormControl('', Validators.required));
      this.loginForm.removeControl('otp')
      this.onlymobile = false
      this.mpwd = false;
      this.epwd = true;
      this.otpText = 'Sign in With OTP'
    }
    else {
      this.onlymobile = true;
      this.mpwd = false;
      this.epwd = false;
      this.loginForm.addControl('otp', new FormControl('', Validators.required));
      this.loginForm.removeControl('password')
      this.otpText = 'Sign in With Password'
    }
  }

  signinWithMobilePassword() {

    this.mpwd = !this.mpwd;

    if (this.mpwd) {
      this.loginForm.addControl('password', new FormControl('', Validators.required));
      this.loginForm.removeControl('otp')
      this.otpText = 'Sign in With OTP'
    }
    else {
      this.loginForm.addControl('otp', new FormControl('', Validators.required));
      this.loginForm.removeControl('password')
      this.otpText = 'Sign in with Password'
    }
  }
  switchtoemailotp() {
    this.epwd = !this.epwd;

    if (this.epwd) {
      this.loginForm.addControl('password', new FormControl('', Validators.required));
      this.loginForm.removeControl('otp')
      this.otpText = 'Sign in With Otp'
    }
    else {
      this.loginForm.addControl('otp', new FormControl('', Validators.required));
      this.loginForm.removeControl('password')
      this.otpText = 'Sign in with Password'
    }
  }

  signinWithOtp() {
    this.isSigninButton = true;
    this.label = 'Mobile No'
    this.loginForm.removeControl('password');
    this.loginForm.addControl('otp', new FormControl('', Validators.required));
    this.loginForm.patchValue({
      mob_email: null
    })
    // delete this.loginDetails.password;
    // this.loginDetails['otp'] = '';
    // this.loginDetails['type'] = 'otp';
    this.loginForm.updateValueAndValidity();
  }


  numberError = false;
  errorTxt = ''
  sendLoginOtp() {
    this.numberError = false;
    let mobileNumber = this.loginForm.get('mob_email')?.value;
    let allowNums = ['6', '7', '8', '9'];
    if(!allowNums.includes(mobileNumber.slice(0,1)) || mobileNumber.length < 10) {
      this.errorTxt = 'Invalid Mobile Number';
      this.numberError = true;
      return;
    }
    this.otpLoading = true;
    this.authenticationService.checkBuyerAccount(mobileNumber).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.status == 200) {
          if (res.signup_step == 0) {
            this.errorTxt = res.message;
            this.numberError = true;
            // this.toastr.error(res.message);
          } 
          else this.sendOTP();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => {
        console.error('error in signin check: ', err.message)
        this.otpLoading = false;
      } 
    });
  }

  sendLoginOtpV2() {
    let email = this.loginForm.get('mob_email')?.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) {
      this.toastr.error("Invalid Email Format");
      return;
    }
    this.otpLoading = true;
    this.authenticationService.checkBuyerAccountEmail(email).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.status == 200) {
          if (res.signup_step == 0) {
            this.toastr.error(res.message);
          } 
          else this.sendOTP();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => {
        console.error('error in signin check: ', err.message)
        this.otpLoading = false;
      } 
    });
  }
  
  
  otpLoading: boolean = false;
  sendOTP() {
    this.otpLoading = true;
    if (this.loginForm.get('mob_email')?.value) {
      this.authenticationService.sendOtpToBuyer(this.loginForm.get('mob_email')?.value).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.isResending = false;
            this.redirectHome$.subscribe();
            this.otpLoading = false;
            this.otpSent = true
            this.isOtpDisabled = true
            this.showLogin = true
            this.toastr.success(res.message);
          }
          else {
            this.otpLoading = false;
            this.toastr.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.otpLoading = false;
          this.toastr.error(err.message);
        }
      })
    } else {
      this.toastr.error('Please Enter Valid Mobile Number')
    }
  }
  forgetResending = false;
  sendForgotOtp() {
    if (this.forgotForm.get('mobile')?.value) {
      this.authenticationService.checkBuyerAccount(this.forgotPasswordDetails.mobile).subscribe(res => {
        if (res.signup_step === 0) {
          this.toastr.error('User not registered with this mobile number');
        } else if (res.signup_step === 2) {
          this.redirectHome$.subscribe();
          this.forgetResending = true;
          this.authenticationService.sendOtpToBuyer(this.forgotPasswordDetails.mobile).subscribe(res => {
            this.toastr.success(`OTP Sent to +91${this.forgotPasswordDetails.mobile}`);
          })
        }
      })
    } else {
      this.toastr.error('Please Enter Mobile Number')
    }
  }

  passwordMatch: boolean = true;
  checkPasswordMatch() {
    this.passwordMatch = this.fpass?.value == this.fpassConfirm?.value;
  }
  
  createPassword() {
    if (this.forgotForm.valid) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordData: any = {
        otp: this.fotp?.value,
        password: this.fpass?.value
      }
      if (emailRegex.test(this.fmobile?.value)) {
        passwordData['email'] = this.fmobile?.value
      } else {
        passwordData['mobile'] = this.fmobile?.value
      }
      // if(this.newPassword?.value.length < 8) {
      //   this.validPassword = false;
      // } 
      this.authenticationService.updateBuyerPassword(passwordData).subscribe({
        next: (value: any) => {
          if(value.status === 200) {
            this.toastr.success(value.message);
            this.forgotForm.reset();
            // this.isForgotPassword = false;
            this.showPasswordResetSuccess = true;
            // this.router.navigate(['/signin']);
          }
          else if (value.status >= 400) {
            this.showPasswordResetSuccess = true;
            this.toastr.error(value.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.message);
        }
      })
    }
  }

  // Login with otp
  verifyOtp() {
    if (this.loginForm.valid) {
      const data = {
        mob_email: this.loginForm.get('mob_email')?.value,
        type: 'otp',
        otp: this.loginForm.get('otp')?.value
      }
      this.authenticationService.login(data).subscribe({
        next: (value: any) => {
          if (value.status == 200) {
            let user = {token: value.data.token, ...value.data.user};
            let status = value.data.user.sigup_process_completed;
            if(status == "1" || status == 'true') {
              this.setLoginDetails(value.data);
              this.signInFireBase(user.mob_email, user.mob_user_phone);
              this.otpValid = true;
              this.toastr.success("Signed In");
              // this.toastr.success(value.message);
              // this.router.navigate(['/products']);
              this.redirection();
            } else {
              this.redirection(user);
            }
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
      this.toastr.error('Please enter all fields')
    }
  }

  // Login with password
  siginwithpassword() {
    if (this.loginForm.valid) {
      const data = {
        mob_email: this.loginForm.get('mob_email')?.value,
        type: 'password',
        password: this.loginForm.get('password')?.value
      }
      this.authenticationService.login(data).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            let user = {token: res.data.token, ...res.data.user};
            let status = res.data.user.sigup_process_completed;
            if(status == "1" || status == 'true') {
              this.setLoginDetails(res.data);
              this.signInFireBase(user.mob_email, user.mob_user_phone);
              // this.toastr.success(res.message);
              this.toastr.success("Signed In");
              this.loginForm.reset();
              // this.router.navigate(['/products']);
              this.redirection();
            } else {
              this.redirection(user);
            }
          } else  {
            this.toastr.error(res.message);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error("Password error: " + error)
          this.toastr.error("Invalid Password")
        }
      })
    } else {
      this.toastr.error('Please enter all fields')
    }
  }

  signInFireBase(email: string, password: string): void {
    if(email !== undefined ) {
      this.chatService.signInWithEmailAndPassword(email, password, this.userObj.buyerId).then(() => {}).catch(err => {
        // this.chatService.createUserWithEmailAndPassword(email, password);
      });
    } else console.error('email value', email)
  }



  async signInWithFB(): Promise<void> {
    //this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    const provider = new firebase.auth.FacebookAuthProvider()
    await this.auth.signInWithPopup(provider).then((r) => {
      console.log(r)
      let profile: any = r.additionalUserInfo?.profile
      this.authenticationService.loginWithSocial(profile.email, 'facebook').subscribe(res => {
        if (res.status == 200) {
          let user = {token: res.data.token, ...res.data.user};
          let status = res.data.user.sigup_process_completed;
          if(status == "1" || status == 'true') {
            this.setLoginDetails(res.data);
            this.signInFireBase(user.mob_email, user.mob_user_phone);
            // this.toastr.success(res.message);
            this.toastr.success("Signed In");
            this.redirection();
          } else {
            this.redirection(user);
          } 
        }
      })
    });
  }

  async signInWithFacebook(): Promise<void> {
    try {
      const user: SocialUser = await this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID);
      if (user) {
        this.authenticationService.loginWithSocial(user.email, 'facebook').subscribe(res => {
          if (res.status == 200) {
            let user = {token: res.data.token, ...res.data.user};
            let status = res.data.user.sigup_process_completed;
            if(status == "1" || status == 'true') {
              this.setLoginDetails(res.data);
              this.signInFireBase(user.mob_email, user.mob_user_phone);
              // this.toastr.success(res.message);
              this.toastr.success("Signed In");
              this.redirection();
            } else {
              this.redirection(user);
            } 
          }
          else {
            this.toastr.error(res.message);
          }
        })
      }
    } catch (error) {
      console.log('Facebook sign-in error:', error);
    }
  }


  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    await this.auth.signInWithPopup(provider).then((r) => {
      let profile: any = r.additionalUserInfo?.profile
      this.authenticationService.loginWithSocial(profile.email, 'gmail').subscribe(res => {
        if (res.status == 200) {
          let user = {token: res.data.token, ...res.data.user};
          let status = res.data.user.sigup_process_completed;
          if(status == "1" || status == 'true') {
            // console.log(res.data);
            this.setLoginDetails(res.data);
            this.signInFireBase(user.mob_email, user.mob_user_phone);
            // this.toastr.success(res.message);
            this.toastr.success("Signed In");
            this.redirection();
          } else {
            this.redirection(user);
          } 
        }
        else {
          this.toastr.error(res.message);
        }
      })
    });
  }

  setLoginDetails(res: any) {
    this.authenticationService.deleteToken();
    this.authenticationService.deleteUserObj();
    this.authenticationService.setToken(res.token);
    this.rfq.setHeaders(res.token, res.user.pk_mobile_user_id);
    if(res.user.delete_request && res.user.delete_request.status == 'Pending') {
      this.openDeletePopup();
    }
    this.userObj.email = res.user.mob_email ? res.user.mob_email : "";
    this.userObj.mobile = res.user.mob_user_phone ? res.user.mob_user_phone : 0;
    this.userObj.userId = res.user.account_id;
    this.userObj.name = res.user.mob_first_name ? res.user.mob_first_name : "";
    this.userObj.buyerId = res.user.pk_mobile_user_id ? res.user.pk_mobile_user_id : 0
    this.userObj.institueName = res.user.mob_user_school_name ? res.user.mob_user_school_name : "";
    this.userObj.avatar = res.user.mob_user_avatar ? res.user.mob_user_avatar : ""
    this.userObj.assignee = res.user.assignee_info;
    this.authenticationService.setUserObj(JSON.stringify(this.userObj))

    let uniqueId = localStorage.getItem('uniqueId') ?? '';
    // If the unique ID is not present in local storage, generate and store it
    if (!uniqueId) {
      uniqueId = uuidv4();
      localStorage.setItem('uniqueId', uniqueId);
    }
  }


  redirection(obj?: any) {
    if (this.popDisplay) {
      if(obj) {
        let object = {
          isSignIn: false,
          obj
        }
        this.actionclose.emit(object);
      }
      else {
        let object = {
          isSignIn: true
        }
        this.actionclose.emit(object);
      }
    }
    else {
      if(obj) {
        let object = {
          isSignIn: false,
          obj
        }
        this.openDialog(object);
      }
      else {
        if(this.isRedirected) {
          this.router.navigateByUrl(this.redirectionUrl);
        } 
        else {
          this.router.navigate(['/products']);
        }
      }
    }
  }

  openDialog(obj: any): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '850px',
      data: obj,
      disableClose: true
    });
  }

  signUpClicked() {
    if (this.popDisplay) {
      this.actionclose.emit({isSignIn: true, close: true});
    }
    this.router.navigate(['/signup'])
  }

  forgotPwd() {
    this.createForgotForm();
    this.isForgotPassword = true;
  }

  emailpwd() {
    this.otpSent = false;
    this.mpwd = false;
    this.epwd = false;
    this.isOtpDisabled = false;
    this.loginForm.patchValue({
      mob_email: null,
      otp: null
    })
  }
  mobilepwd() {
    this.otpSent = false;
    this.mpwd = false;
    this.epwd = false;
    this.isOtpDisabled = false;
    this.loginForm.patchValue({
      mob_email: null,
      otp: null
    })
  }

  countDown$ = timer(0, 1000).pipe(
    map((value) => 30 - value),
    takeWhile((value) => value >= 0)
  );

  isResending: boolean = false;
  redirectHome$ = this.countDown$.pipe(
    tap((value) => {
      if (value <= 0) {
        this.forgetResending = false;
        this.isResending = true;
      }
    })
  );

  limitCharacters(type: string, limit: number, event: any) {
    let value: string = event.target.value;
    if(value.length > limit) {
      value = value.substring(0, limit);
    }
    let obj: {[key: string]: any} = {}
    obj[type] = value;
    this.loginForm.patchValue(obj)
  }

  // Forget passwords section
  forgetNumberError = false;
  forgetErrorTxt = '';
  checkForgetOtp() {
    this.forgetNumberError = false;
    let mobileNumber = this.fmobile?.value;
    let allowNums = ['6', '7', '8', '9'];
    if(!allowNums.includes(mobileNumber.slice(0,1)) || mobileNumber.length < 10) {
      this.forgetErrorTxt = 'Invalid Mobile Number';
      this.forgetNumberError = true;
      return;
    }
    this.otpLoading = true;
    this.authenticationService.checkBuyerAccount(mobileNumber).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.status == 200) {
          if (res.signup_step == 0) {
            this.forgetErrorTxt = res.message;
            this.forgetNumberError = true;
            // this.toastr.error(res.message);
          } 
          else this.sendForgetOTP();
        } else {
          this.forgetErrorTxt = res.message;
          this.forgetNumberError = true;
          // this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('error in signin check: ', err.message)
        this.otpLoading = false;
      } 
    });
  }

  forgetOtpSent = false;
  sendForgetOTP() {
    this.otpLoading = true;
    if (this.fmobile?.value) {
      this.authenticationService.sendOtpToBuyer(this.fmobile?.value).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.isResending = false;
            this.redirectHome$.subscribe();
            this.otpLoading = false;
            this.forgetOtpSent = true
            this.isOtpDisabled = true
            this.showLogin = true
            this.toastr.success(res.message);
          }
          else {
            this.otpLoading = false;
            this.toastr.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.otpLoading = false;
          this.toastr.error(err.message);
        }
      })
    } else {
      this.toastr.error('Please Enter Valid Mobile Number')
    }
  }

  forgetNotYou() {
    this.forgetOtpSent = false;
    this.isOtpDisabled = false;
    this.forgotForm.reset();
  }

  get fmobile() {
    return this.forgotForm.get('mobile');
  }

  get fotp() {
    return this.forgotForm.get('otp') as FormControl;
  }

  get fpass() {
    return this.forgotForm.get('newPassword');
  }

  get fpassConfirm() {
    return this.forgotForm.get('confirmPassword');
  }

  isFOtpVerified = false;
  verifyForgetOtp() {
    if (this.fmobile?.value && this.fotp?.value) {
      const data = {
        mobile: this.fmobile?.value,
        otp: this.fotp?.value
      }
      this.authenticationService.verifyBuyerOtp(data).subscribe({
        next: (value: any) => {
          if (value.status == 200) {
            this.isFOtpVerified = true;
            this.fpass?.reset();
            this.fpassConfirm?.reset();
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
      this.toastr.error('Please enter all fields')
    }
  }

  showPasswordResetSuccess = false;
  loginafterReset() {
    this.router.navigate(['/signin']).then(() => {
      window.location.reload();
    })
  }

  deleteDialogRef: any;
  openDeletePopup() {
    this.deleteDialogRef = this.dialog.open(DeletePopupConfirmComponent, {
      width: '750px',
      disableClose: true
    });
    this.deleteDialogRef.afterClosed().subscribe(() => {
      
    });
  }

  // back to same page after signed in 
  isRedirected = false;
  redirectionUrl = '';

  myClass2 = {
    "me-0 me-md-4": !this.onlymobile,
  }
}