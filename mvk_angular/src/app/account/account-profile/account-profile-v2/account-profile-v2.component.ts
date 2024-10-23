import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MobileOtpComponent } from './mobile-otp/mobile-otp.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpVerifyPopupComponent } from './otp-verify-popup/otp-verify-popup.component';

@Component({
  selector: 'app-account-profile-v2',
  templateUrl: './account-profile-v2.component.html',
  styleUrls: ['./account-profile-v2.component.scss']
})
export class AccountProfileV2Component implements OnInit{

  private auth = inject(AuthenticationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  constructor(private dialog: MatDialog,private toastr: ToastrService, private rfq: RfqService) {
    this.createMyprofileForm();
  }
  ngOnInit(): void {
    this.getQueryParams();
    this.getMyProfileDropdowns();
    // this.getBuyerProfileDetails();
    this.auth.profilePic$.subscribe((image: string) => {
      this.user.photo = image;
      this.showImgOptions = false;
    });
  }

  getQueryParams() {
    this.route.queryParamMap.subscribe(params => {
      let deleteStr = params.get('account');
      let passWd = params.get('forget');
      if(deleteStr && deleteStr === 'delete') {
        this.getUser();
      }
      else if(passWd && passWd === 'password') {
        this.createForgotForm();
        this.showProfile = false;
        this.showDelete = false;
      } else {
        this.showProfile = true;
      }
    });
  }

  // getUserDetails() {
  //   const token = localStorage.getItem('token') ?? "";
  //   this.rfq.getUserDetails(token).subscribe({
  //     next: (value: any) => {
  //       if (value.status === 200) {
  //         this.user = value.data;
  //         this.email = value.data.mob_email;
  //         this.mobile = value.data.mob_user_phone;
  //         this.userAddress = value.data.user_address;
  //         this.updateMyprofileForm(value.data);
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       if(err.status === 500) {
  //         this.serverDown = true;
  //       }
  //       this.toastr.error(err.error.message)
  //       console.error(err.message, err.error);
  //     }
  //   })
  // }

  selectedFile!: File;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
      // File is an image, proceed with the upload
      this.updateUserPic(this.selectedFile);
      // Your logic to handle the image upload
    } else {
      // File is not an image, show an error message or handle the error
      this.toastr.error('Selected file is not an image.');
    }
  }
  
  // Image preview function
  prepareImageForUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }
  
  updateUserPic(image: File) {
    let obj = new FormData();
    obj.append('avatar', image);
    this.rfq.updateUserPic(obj).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.user.photo = value.fileUrl;
          this.auth.setProfilePic(value.fileUrl);
          this.showImgOptions = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  getMobDesignation(): any {
    return [{"id":1,"name":"Teacher"},{"id":2,"name":"Principal"}, {"id":3,"name":"School Owner"}]
    .find((el) => el.id == this.user.mob_user_designation)?.name;
  }

  // Edit Button Components Not using
  dialogRef!: MatDialogRef<any>;
  editBasicDetails() {
    this.dialogRef = this.dialog.open(BasicDetailsComponent, {
      width: '1000px',
      data: {user: this.user}
    });
    this.dialogRef.afterClosed().subscribe(() => this.getUserDetails());
  }

  editContact() {
    this.dialogRef = this.dialog.open(ContactInfoComponent, {
      width: '1000px',
      data: this.user
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getUserDetails();
    });
  }

  isBusinnessTypeSet = true;




  // new account logics and API's
  userAddress: any;
  serverDown: boolean = false;
  user: any;
  socialLinkNames: {id: string, name: string, show: boolean}[] = [];

  getUserDetails() {
    this.auth.getMyProfile().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.user = value.user;
          this.email = value.user.email;
          this.mobile = value.user.number;
          this.auth.setProfilePic(value.user.photo);
          this.updateMyprofileForm(value.user);
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          this.serverDown = true;
        }
        this.toastr.error(err.error.message)
        console.error(err.message, err.error);
      }
    })
  }
  
  showMyProfile = true;

  dropdowns: any[] = [];

  schoolDropdowns: any;
  getMyProfileDropdowns() {
    this.auth.getMyProfileDropdowns().subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.dropdowns = res.data.respondent_type;
          this.schoolDropdowns = res.data;
          let socials = res.data.social_links;
          this.socialLinkNames = socials.map((social: any) => {
            this.mediaInputs.addControl(social.id, new FormControl(''));
            return {...social, show: false}
          })
          this.getUserDetails();
          // this.dropdowns = res.data;
        }
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Profile page dropdown error')
    });
  }
  
  hideVerifyEmail: boolean = true;
  email: string = "";
  // showSendOtpEmail = false;
  onEmailChange() {
    this.hideVerifyEmail = this.email == this.user.email;
    // this.showSendOtpEmail = this.email !== this.user.email;
  }

  // readonlyEmail = true;
  // readonlyMobile = true;
  // editChange(name: string) {
  //   if(name == 'email') {
  //     this.readonlyEmail = false;
  //   }
  //   if(name == 'mobile') {
  //     this.readonlyMobile = false;
  //   }
  // }

  checkBuyerAccountEmail() {
    if(!Boolean(this.email)) {
      this.toastr.error("Email is required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!emailRegex.test(this.email)) {
      this.toastr.error("Invalid Email Format");
      return;
    }
    this.auth.checkBuyerAccountEmail(this.email).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (res.signup_step == 2) this.toastr.success(res.message);
          else this.sendOtptoEmail();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
    });
  }

  sendOtptoEmail() {
    this.auth.signUpOtpEmail(this.email).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.updateEmailPopup(this.email)
          this.toastr.success(res.message);
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.warning('Invalid Email')
    });
  }

  updateEmailPopup(email: string): void {
    this.dialogRef = this.dialog.open(OtpInputComponent, {
      width: '650px',
      data: {email, mobile: parseInt(this.user.number)},
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      if(_result) {
        this.user.email = _result;
        this.hideVerifyEmail = true;
      }
    });
  }

  hideVerifyMobile: boolean = true;
  // showSendOtpMobile = false;
  onMobileChange() {
    this.hideVerifyMobile = this.mobile == this.user.number;
  }



  mobile: string = "";
  checkBuyerAccount() {
    if(!Boolean(this.mobile)) {
      this.toastr.error('Mobile number is required');
      return;
    }
    let allowNums = ['6', '7', '8', '9'];
    let mobileStr = this.mobile.toString();
    if(!allowNums.includes(mobileStr.slice(0,1)) || mobileStr.length < 10) {
      this.toastr.error('Invalid Mobile Number');
      return;
    }
    this.auth.checkBuyerAccount(this.mobile).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (res.signup_step == 2) this.toastr.success(res.message);
          else this.sendOtp();
        } else {
          this.toastr.error(res.message);
        } 
      },
      error: (err: HttpErrorResponse) => {
        console.error('error in signup check: ', err.message)
      } 
    });
  }

  sendOtp() {
    this.auth.updateMobileNumberOtp(this.mobile).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.updateMobilePopup(this.mobile);
          this.toastr.success(res.message);
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Mobile Number')
    });
  }

  updateMobilePopup(mobile: string): void {
    this.dialogRef = this.dialog.open(MobileOtpComponent, {
      width: '650px',
      data: {mobile},
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      if(_result) {
        this.user.number = _result;
        this.hideVerifyMobile = true;
      }
    });
  }

  myProfileForm!: FormGroup;
  private fb = inject(FormBuilder);
  first = true;
  createMyprofileForm() {
    this.myProfileForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      hos_type: ['0'],
      alternative_email: [''],
      telephone: [''],
      fax: [''],
      social_links: [[]],
    });
    this.socialLinks.valueChanges.subscribe((selectedMedia: string[]) => {
      this.selectedMedia = selectedMedia;
      this.socialLinkNames = this.socialLinkNames.map(social => {
        if(selectedMedia.includes(social.id)) {
          return {...social, show: true}
        } else {
          return {...social, show: false};
        }
      })
    });
    this.resType.valueChanges.subscribe((id: string) => {
      if(id === '1') {
        this.showHosType = true;
      } else {
        this.showHosType = false;
      }
      if(!this.first) {
        this.myProfileSubmit(id, false);
        // console.log(id);
      }
      this.first = false;
    })
  }

  get socialLinks() {
    return this.myProfileForm.get('social_links') as FormControl;
  }

  get resType() {
    return this.myProfileForm.get('type') as FormControl;
  }

  mediaInputs: FormGroup = this.fb.group({});
  selectedMedia: string[] = [];

  updateMyprofileForm(user: any) {
    this.myProfileForm.patchValue({
      name: user.name,
      type: user.type_id ?? 0,
      alternative_email: user.alternate_email,
      telephone: user.telephone || '',
      fax: user.fax,
      hos_type: user.profile_hos_type_id
    })
    let selectedStr: string[] = [];
    user.social_links.forEach((social: any) => {
      if (social.name && this.mediaInputs.controls[social.id]) {
        selectedStr.push(social.id);
        this.mediaInputs.controls[social.id].setValue(social.name);
        let index = this.socialLinkNames.findIndex(socialName => socialName.id == social.id)
        this.socialLinkNames[index].show = true;
      }
    })
    this.showHosType = user.type_id == 1;
    this.socialLinks.patchValue(selectedStr);
  }


  myProfileSubmit(id: string, required: boolean) {
    let fd = this.myProfileForm.value;
    if(!this.validationsCheck(fd, id, required)) {
      if(parseInt(id) > 0) {
        this.myProfileForm.patchValue({
          type: this.user.type_id,
        })
        if(this.user.type_id == '1') {
          this.showHosType = true;
        } else {
          this.showHosType = false;
        }
      }
      return;
    }
    const obj: any = {
      name: fd.name,
      respondent_type: parseInt(id) > 0 ? id : fd.type,
      alternate_email: fd.alternative_email,
      telephone_number: fd.telephone || 0,
      fax_number: fd.fax,
      profile_hos_type: fd.hos_type
    }
    this.selectedMedia.forEach(media => {
      // if(this.mediaInputs.value[media] == "") {
      //   alert(`${media} must not be empty`);
      //   return;
      // }
      obj[media] = this.mediaInputs.value[media];
    })
    this.auth.updateMyProfile(obj).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if(!parseInt(id)) {
            this.user.name = obj.name;
            this.toastr.success(res.message);
          }
          this.user.type_id = obj.respondent_type;
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server Error');
        console.log('edit profile error', err.message);
      }
    });
  }

  alternateEmailError = '';
  validationsCheck(fd: any, id: string, required: boolean): boolean {
    
    if(required && !this.hideVerifyEmail) {
      if(!this.email) {
        this.toastr.error('Please enter Email');
      } else {
        this.toastr.error('Please verify your Email');
      }
      return false;
    }
    if(required && !this.hideVerifyMobile) {
      if(!this.mobile) {
        this.toastr.error('Please enter Mobile number');
      } else {
        this.toastr.error('Please verify your Mobile');
      }
      return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    let telephoneNum: string = fd.telephone.toString();
    let allowNums = ['6', '7', '8', '9'];
    
    if(!fd.name) {
      this.toastr.error('Respondent Name required');
      return false;
    } 
    else if (fd.alternative_email == this.email) {
      this.alternateEmailError = 'Alternate Email must be different';
      return false;
    }
    else if (fd.alternative_email && !emailRegex.test(fd.alternative_email)) {
      this.toastr.error("Invalid Alternate Email");
      return false;
    }
    else if(required && !fd.type) {
      this.toastr.error('Respondent Type required');
      return false;
    }
    else if(!(parseInt(id) > 0) && this.showHosType && !fd.hos_type) {
      this.toastr.error('Hos Type required');
      return false;
    }
    else if(fd.fax && fd.fax.length < 6) {
      this.toastr.error('Invalid Fax number');
      return false;
    }
    // else if(!fd.telephone) {
    //   this.toastr.error('Telephone required');
    //   return false;
    // }
    else if(fd.telephone && telephoneNum.length < 10) {
      this.toastr.error('Invalid telephone number');
      return false;
    }
    else {
      return true;
    }
  }

  
  cancel() {
    // this.myProfileForm.reset();
    // this.updateMyprofileForm(this.user);
    this.router.navigateByUrl("/");
  }

  @ViewChild('alertHomeTemplate') alertHomeTemplate!: TemplateRef<any>;
  alertHomeTemplateRef!: MatDialogRef<any, any>;
  openAlert() {
    this.alertHomeTemplateRef = this.dialog.open(this.alertHomeTemplate, {
      width: '650px',
      // disableClose: true,
    });

    this.alertHomeTemplateRef.afterClosed().subscribe((res: any) => {
      this.alertHomeTemplateRef.close();
    });
  }

  closeAlert() {
    this.alertHomeTemplateRef.close();
  }

  // account delete request 
  showProfile = true;
  showDelete = true;

  delete = new FormControl('1');

  deleteObj: any;
  getUser() {
    this.rfq.getUserDetails('').subscribe({
      next: (res: any) => {
        if(res.status == 200) {
          this.deleteObj = res.data.delete_request;
          this.showProfile = false;
          this.showDelete = true;
          this.delete.valueChanges.subscribe(status => {
            if(status === '0') this.navTo();
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.router.navigate(['error']);
      }
    })
  }
  
  reason = "";
  showReasonError = false
  sendDeleteRequest() {
    this.showReasonError = false;
    if(this.reason === '') {
      this.showReasonError = true;
      return;
    }
    let obj = {
      reason: this.reason
    }
    this.auth.sendDeleteRequest(obj).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.navTo();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Mobile Number')
    });
  }

  cancelDeleteRequest() {
    this.auth.cancelDeleteRequest().subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.navTo();
        } else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Mobile Number')
    });
  }

  navTo() {
    this.router.navigate(['/']);
  }

  // Change Password

  forgotForm!: FormGroup;
  createForgotForm(): void {
    this.forgotForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    })
  }

  get fpass() {
    return this.forgotForm.get('newPassword');
  }

  get fpassConfirm() {
    return this.forgotForm.get('confirmPassword');
  }

  // methods
  forgetOtpSent = false;
  sendForgetOTP() {
    if (this.mobile) {
      this.auth.sendOtpToBuyer(this.mobile).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.forgetPassOtpPopup(this.mobile);
          }
          else {
            this.toastr.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.message);
        }
      })
    } else {
      this.toastr.error('Please Enter Valid Mobile Number')
    }
  }

  forgetOtp: string = '';
  isFOtpVerified = false;
  forgetPassOtpPopup(mobile: string): void {
    this.dialogRef = this.dialog.open(OtpVerifyPopupComponent, {
      width: '650px',
      data: {mobile},
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      if(_result) {
        this.forgetOtp = _result.otp;
        this.isFOtpVerified = true;
      }
    });
  }

  newPasshide: boolean = true;
  passwordMatch: boolean = true;
  checkPasswordMatch() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(this.fpass?.value)) {
      this.validPassword = false;
    } else {
      this.validPassword = true;
    }
    if(this.fpassConfirm?.value) {
      this.passwordMatch = this.fpass?.value == this.fpassConfirm?.value;
    }
  }
  
  validPassword = true;
  createPassword() {
    this.validPassword = true;
    let password = this.fpass?.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(password)) {
      this.validPassword = false;
      this.toastr.error("Invalid password");
      return;
    }
    if (this.forgotForm.valid) {
      const passwordData: any = {
        otp: this.forgetOtp,
        password: password,
        mobile: this.mobile
      }
      this.auth.updateBuyerPassword(passwordData).subscribe({
        next: (value: any) => {
          if(value.status === 200) {
            this.toastr.success(value.message);
            this.gotohomeafterReset();
          }
          else if (value.status >= 400) {
            this.toastr.error(value.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.message);
        }
      })
    }
  }

  gotohomeafterReset() {
    this.router.navigate(['/']);
  }

  removeProfilePic() {
    this.auth.deleteProfilePic().subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.toastr.success(value.message);
          this.user.photo = value.photo;
          this.auth.setProfilePic(value.photo);
          this.showRemoveProfileDialogRef.close();
          this.showImgOptions = false;
        }
        else if (value.status >= 400) {
          this.toastr.error(value.message);
          this.showRemoveProfileDialogRef.close();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message);
      }
    })
  }

  showHosType =  false;

  // change password dependecies 



  showImgOptions = false;
  clickImgOptions(){
    this.showImgOptions = !this.showImgOptions;
  }

  @ViewChild('showProfileImg') showProfileImg!: TemplateRef<any>;
  showProfileImgRef!: MatDialogRef<any, any>;
  openProfileImg() {
    this.showProfileImgRef = this.dialog.open(this.showProfileImg, {
      width: '300px',
      height: '300px',
      // disableClose: true,
    });

    this.showProfileImgRef.afterClosed().subscribe((res: any) => {
      this.showImgOptions = false;
    });
  }

  closeProfileImg() {
    this.showProfileImgRef.close();
  }
  

  @ViewChild('showRemoveProfileDialog') showRemoveProfileDialog!: TemplateRef<any>;
  showRemoveProfileDialogRef!: MatDialogRef<any, any>;
  openRemoveProfileDialog() {
    this.showRemoveProfileDialogRef = this.dialog.open(this.showRemoveProfileDialog, {
      width: '650px',
      // disableClose: true,
    });

    this.showRemoveProfileDialogRef.afterClosed().subscribe((res: any) => {
    });
  }

  closeRemoveProfileDialog() {
    this.showRemoveProfileDialogRef.close();
  }

  @ViewChild('showWebcamDialog') showWebcamDialog!: TemplateRef<any>;
  showWebcamDialogRef!: MatDialogRef<any, any>;
  webCamLoader = false;
  firstLoader = true;
  openWebcam() {
    if(this.firstLoader) {
      this.webCamLoader = true;
      this.firstLoader = false;
      setTimeout(() => {
        this.webCamLoader = false;
      }, 2500)
    } else {
      this.webCamLoader = false;
    }
    this.showWebcamDialogRef = this.dialog.open(this.showWebcamDialog, {
      width: '500px',
      height: '500px',
      // disableClose: true,
    });

    this.showWebcamDialogRef.afterClosed().subscribe((res: any) => {
    });
  }

  closeWebcamDialog() {
    this.showImgOptions = false;
    this.showWebcamDialogRef.close();
  }

}

