import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RfqService } from '../../services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { timer, map, takeWhile, tap } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rfq-dm',
  templateUrl: './rfq-dm.component.html',
  styleUrl: './rfq-dm.component.scss'
})
export class RfqDmComponent implements OnInit {

  private fb = inject(FormBuilder);
  private rfqService = inject(RfqService);
  private toastr = inject(ToastrService);
  private auth = inject(AuthenticationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private dialog: MatDialog) {
    this.getParams();
  }

  ngOnInit(): void {
    this.getAllDoprdownsWithoutSignin();
  }

  getParams() {
    this.route.queryParamMap.subscribe(params => {
      const rfqCode = params.get('url') ?? '';
      if(rfqCode) {
        this.getRfqDetails(rfqCode);
      } else {

      }
    })
  }

  rfqDetails!: RfqDetails;
  campaignNotFound = false;
  loader = false;
  campaignId = 0;
  getRfqDetails(code: string) {
    this.loader = true;
    this.rfqService.getRfqDetailsFromUrl(code).subscribe({
      next: (res) => {
        this.loader = false;
        if(res.status == 200) {
          this.rfqDetails = res.data;
          this.campaignId = res.data.campaign_id
          this.updateForm(this.rfqDetails);
        } else {
          this.isDisabled = false
        }
      },
      error: (err: HttpErrorResponse) => {
        this.campaignNotFound = true;
        this.isDisabled = false
        this.loader = false;
      }
    })
  }

  categoryId: string = "";
  updateForm(rfq: RfqDetails) {
    if(this.rfqDetails.category) {
      this.categoryId = this.rfqDetails.category
    }
    this.rfqs.controls[0].patchValue({
      product_name: rfq.product_name,
      description: rfq.description
    })
  }
  
  units: any[] = [];
  getAllDoprdownsWithoutSignin() {
    this.rfqService.getAlldropdownDataV2('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.units = res.units;
      }
    });
  }
  
  // code-t

  isDisabled = true;
  editField(){
    this.isDisabled = false;
  }

  showOtp = false;

  clickVerify(){
    this.showOtp = true;
  }

  // notYou(){
  //   this.showOtp = false;
  // }

  @ViewChild('otp1') otp1!: ElementRef;
  @ViewChild('otp2') otp2!: ElementRef;
  @ViewChild('otp3') otp3!: ElementRef;
  @ViewChild('otp4') otp4!: ElementRef;

  otp: string[] = ['', '', '', ''];
  onInput(event: Event, nextInput: any): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
    if(this.checkOtp()) {
      let otpNum = parseInt(this.otp.join(''));
      if(otpNum > 1000) {
        this.verifyOtp(otpNum);
      }
    }
  }

  checkOtp(): boolean {
    let otpLength = 0;
    this.otp.forEach((otp) => {
      if(otp) {
        otpLength++;
      }
    })
    return otpLength === 4;
  }

  onBackspace(event: any, previousInput: any): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 0 && event.key === 'Backspace' && previousInput) {
      previousInput.focus();
    }
  }
  
  // Reactive Forms 
  rfqForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    number: ['', Validators.required],
    rfqs: this.fb.array([this.createRfq()]),
    rfqTerms: ['', Validators.required],
    signupTerms: ['', Validators.required]
  }); 

  get rfqs() {
    return this.rfqForm.get('rfqs') as FormArray;
  }

  createRfq(): FormGroup {
    return this.fb.group({
      product_name: ['', Validators.required],
      units: ['1', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addRfqForm() {
    if(this.rfqs.length < 5) {
      this.rfqs.push(this.createRfq());
      this.txtArray.push('Generate');
    }
  }

  removeRfq(index: number) {
    if (this.rfqs.length > 1) {
      this.rfqs.removeAt(index);
      this.txtArray.splice(index, 1);
      let rfqsDuplicate = this.rfqs.controls;
      this.rfqs.controls = [];
      setTimeout(() => {
        this.rfqs.controls = rfqsDuplicate;
      })
    }
  }

  txtArray: string[] = ['Generate'];

  generateTxt = 'Generate';
  aiLoader = false;
  aiIndex = 0;
  getChatGPTDescription(index: number) {
    this.aiIndex = index;
    let form = this.rfqs.controls[index];
    let fd = form.value;
    if(fd.product_name == '') {
      this.toastr.error('Product Name required');
      return;
    }
    if(fd.quantity == '') {
      this.toastr.error('Quantity required');
      return;
    }
    let obj = {
      searchkey: fd.product_name,
      quantity: fd.quantity
    }
    this.aiLoader = true;
    this.rfqService.getChatGPTDescription(obj).subscribe({
      next: (res: any) => {
        this.aiLoader = false;
        if(res.status == 200) {
          this.txtArray[index] = 'Regenerate'
          let str = res.data;
          form.patchValue({
            description: str
          })
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.aiLoader = false;
        console.log(err.error);
      }
    });
  }
  
  

  submit() {
    if(!this.verified) {
      this.toastr.error('Please verify mobile number');
      return;
    }
    let fd = this.rfqForm.value;
    if(fd.rfqTerms == 0 || fd.signupTerms == 0) {
      this.toastr.error('Please accept the terms');
      return;
    }
    let rfqs  = this.rfqForm.value.rfqs;
    let body: any = {
      name: fd.name,
      mobile: fd.number,
      category_id: this.categoryId,
      terms_and_conditions: fd.rfqTerms == 1,
      signup: fd.signupTerms == 1,
      rfq: [],
      campaign_id: this.campaignId
    }
    let productName = this.rfqs.controls[0].get('product_name')?.value
    if(this.rfqDetails) {
      if(productName != this.rfqDetails.product_name) {
        body['category_id'] = null;
      }
    } else {
      body['category_id'] = null;
    }
    if(this.checkQuantity(rfqs)) {
      rfqs?.forEach((value: any) => {
        body.rfq.push({
          product_name: value.product_name,
          units: value.units,
          quantity: value.quantity,
          description: value.description
        });
      })
    } else {
      this.toastr.error("Quantity is not valid");
    }

    if(!this.checkProductName(rfqs)) {
      this.toastr.error('Product name should atleast 3 characters');
      return;
    }


    // this.afterSubmit(true);
    
    // console.log(body);
    this.submitRFQ(body)
  }
  
  token: string = '';
  submitRFQ(body: any) {
    this.rfqService.postDmRfq(body).subscribe({
      next: (res) => {
        if (res.status == 200 ) {
          // localStorage.setItem('accountExists', "true");
          // this.router.navigateByUrl("/rfq-submission");
        }
        else if(res.status == 201) {
          this.token = res.token;
          this.afterSubmit(res.account_created);
          // localStorage.setItem('r-mobile', body.mobile.toString());
          // localStorage.setItem('r-token', res.token ?? body.mobile.toString());
          // localStorage.setItem('accountExists', "false");
          // this.router.navigateByUrl("/rfq-submission");
        }
        else this.toastr.warning(res.message);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Internal server error");
      }
    })
  }

  accountCreated = false;
  afterSubmit(accountCreated: boolean) {
    this.accountCreated = accountCreated
    let token = localStorage.getItem('token');
    if(token){
      // if another login exits
      let userObj = JSON.parse(localStorage.getItem("userObj") ?? "{}");
      let sameUser = userObj ? userObj.mobile : "" ;
      this.ifUserSignedIn = true;
      if(sameUser == this.signupMobileNum) {
        this.router.navigateByUrl('/account/viewdetails?rfq=all');
      } else {
        this.openAlertDialog();
      }
    } else {
      // if no another login exits

      if(accountCreated) {
        // for new account created

        let mobile = this.signupMobileNum;
        localStorage.setItem('r-mobile', mobile.toString());
        localStorage.setItem('r-token', this.token ?? mobile.toString());
        localStorage.setItem('accountExists', "false");
        this.router.navigateByUrl("/rfq-submission");
      } else {
        // for already existed user

        localStorage.setItem('accountExists', "true");
        this.router.navigateByUrl("/rfq-submission");
      }
    }
  }

  newLogin() {
    localStorage.clear();
    this.closeAlertDialog();
    if(this.accountCreated) {
      // for new account created

      let mobile = this.signupMobileNum;
      localStorage.setItem('r-mobile', mobile.toString());
      localStorage.setItem('r-token', this.token ?? mobile.toString());
      localStorage.setItem('accountExists', "false");
      this.router.navigateByUrl("/rfq-submission");
    } else {
      // for already existed user
      localStorage.setItem('accountExists', "true");
      this.router.navigateByUrl("/rfq-submission");
    }
  }

  checkQuantity(rfqs: any): boolean {
    let isValid = true;
    rfqs?.forEach((value: any) => {
      let quantity = parseInt(value.quantity);
      if(quantity <= 0) {
        isValid = false;
        return;
      }
    })
    return isValid;
  }

  checkProductName(rfqs: any): boolean {
    let isValid = true;
    rfqs?.forEach((value: any) => {
      let name = value.product_name;
      if(name.length < 3) {
        isValid = false;
        return;
      }
    })
    return isValid;
  }

  // confirm mobile code

  isResending: boolean = false;
  
  get numbermob() {
    return this.rfqForm.controls['number'];
  }

  signupMobileNum: number = 0;
  mobileError = false;
  errorTxt = '';
  sendOTP() {
    this.signupMobileNum = this.numbermob.value;
    let allowNums = ['6', '7', '8', '9'];
    let mobileStr = this.signupMobileNum.toString();
    if(!allowNums.includes(mobileStr.slice(0,1)) || mobileStr.length < 10) {
      this.toastr.error('Invalid Mobile Number');
      return;
    }
    this.mobileError = false;
    this.otpLoading = true;
    this.auth.sendOtp(this.signupMobileNum).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.status == 200) {
          this.showOtp = true;
          this.isResending = false;
          this.redirectHome$.subscribe();
          this.toastr.success(res.message);
        } else {
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
  verifyOtp(otp: number) {
    this.otpLoading = true;
    this.invalidOtp = false;
    const data = {
      mobile: this.signupMobileNum,
      otp: otp
    }
    this.auth.verifyBuyerOtp(data).subscribe({
      next: (res) => {
        this.otpLoading = false;
        if (res.status == 200) {
          this.verified = true;
          this.showOtp = false;
          this.toastr.success(res.message);
        } else {
          // this.otp = ['', '', '', ''];
          // this.otp1.focus()
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

  resendOtp() {
    this.sendOTP();
  }

  notYou() {
    this.showOtp = false;
    this.numbermob.reset();
    this.otp = ['', '', '', ''];
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

  @ViewChild('showAlertDialog') showAlertDialog!: TemplateRef<any>;
  showAlertDialogRef!: MatDialogRef<any, any>;
  openAlertDialog() {
    this.showAlertDialogRef = this.dialog.open(this.showAlertDialog, {
      width: '650px',
      // disableClose: true,
    });

    this.showAlertDialogRef.afterClosed().subscribe((res: any) => {
      this.showAlertDialogRef.close();
    });
  }

  reset() {
    this.rfqForm.reset();
  }
  
  closeAlertDialog() {
    this.rfqForm.reset();
    this.showAlertDialogRef.close();
  }

  ifUserSignedIn = false;

}

interface RfqDetails {
  campaign_id: number,
  product_name: string,
  category: string,
  description: string
}