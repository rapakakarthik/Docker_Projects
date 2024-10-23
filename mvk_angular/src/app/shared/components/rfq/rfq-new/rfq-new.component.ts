import { Component, ElementRef, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { RfqsignupComponent } from 'src/app/authentication/signup/rfqsignup/rfqsignup.component';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-rfq-new',
  templateUrl: './rfq-new.component.html',
  styleUrl: './rfq-new.component.scss'
})
export class RfqNewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RfqNewComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private chat: ChatService, 
    @Inject(MAT_DIALOG_DATA) public dataObject: {type: "update" | "create" | "postAgain" | null, obj?: any, isSignedIn: boolean},
    private router: Router
  ) {}
  ngOnInit(): void {
    this.createRfqForm();
    this.fillDetails();
  }

  form!: FormGroup;
  createRfqForm() {
    this.form = this.fb.group({
      product_name: ['', Validators.required],
      quantity: ['', Validators.required],
      units: ['', Validators.required],
      description: ['', Validators.required],
      tandc: ['', Validators.required],
      supplier_business: ['']
    });
  }

  fillDetails() {
    this.isSignedIn = this.dataObject.isSignedIn;
    if(this.isSignedIn) {
      this.getAllDoprdowns();
    } else {
      this.getAllDoprdownsWithoutSignin();
    }
    if(this.dataObject.type == "create") {
      this.form.patchValue({
        product_name: this.dataObject.obj.name
      });
      if(this.dataObject.obj.image) {
        this.previews.push(this.dataObject.obj.image);
        // this.uploadImageFromUrl(this.dataObject.obj.image);
      }
    }
    if(this.dataObject.type == "update" || this.dataObject.type == "postAgain") {
      this.form.patchValue({
        product_name: this.dataObject.obj.product_name,
        quantity: this.dataObject.obj.quantity,
        description: this.dataObject.obj.description,
        tandc: true,
        supplier_business: this.dataObject.obj.supplier_business || this.dataObject.obj.tandc
      });
      if(this.dataObject.obj.files == undefined) this.dataObject.obj.files = [];
      (this.dataObject.obj.files as Array<any>).forEach(file => this.previews.push(file.file_url))
    }
  }

  categoryLoader: boolean = false;
  units: any[] = [];
  questions: any[] = [];
  getAllDoprdowns() {
    this.categoryLoader = true;
    this.rfqService.getAlldropdownData('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.categoryLoader = false;
        this.questions = res.questions;
        this.units = res.units;
        const unit = this.units.find(obj => obj.val == this.dataObject.obj.units);
        if(this.dataObject.type == "update" || this.dataObject.type == "postAgain") {
          this.form.patchValue({
            units: unit.id,
          })
        }
      } else if (r.status == 400) {
        this.logout('Session Expired Signin again');
      }
      else if(r.status == 401) {
        this.logout('Your account was deleted');
      }
    });
  }

  logout(msg: string) {
    this.chat.signOut();
    this.auth.deleteToken();
    this.auth.deleteUID();
    this.auth.deleteUserObj();
    this.router.navigate(['/signin']);
    this.closeRFQpopup();
    this.toastr.error(msg);
  }

  getAllDoprdownsWithoutSignin() {
    this.categoryLoader = true;
    this.rfqService.getAlldropdownDataV2('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.categoryLoader = false;
        this.questions = res.questions;
        this.units = res.units;
      }
    });
  }

  // uploaded files
  @ViewChild('fileInput') fileInput: any;
  selectedImages: File[] = [];
  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
    this.selectedImages = [];
    if(this.previews.length == 0) {
      for (let i = 0; i <= 2; i++) {
        if(i <= selectedFiles.length - 1) {
          if (!selectedFiles[i].type.startsWith('image/')) {
            this.toastr.error('Unsupported File');
            return;
          }
          this.selectedImages.push(selectedFiles[i]);
        }
      }
    } else {
      for (let i = 0; i < (3 - this.previews.length); i++) {
        if(i <= selectedFiles.length - 1) {
          if (!selectedFiles[i].type.startsWith('image/')) {
            this.toastr.error('Unsupported File');
            return;
          }
          this.selectedImages.push(selectedFiles[i]);
        }
      }
    }
    this.fileInput.nativeElement.value = '';
    this.previewImage();
  }

  async uploadImageFromUrl(imageUrl: string) {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl, {mode: 'no-cors'});
      const blob = await response.blob();

      // Create a file from the blob
      const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });
      this.selectedImages.push(file);

      // Use Angular HttpClient to send the FormData to your backend
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // previewd files
  previews: string[] = [];
  previewImage() {
    // this.previews = [];
    if (!this.selectedImages) {
      this.previews = [];
      return;
    }
    for (const image of this.selectedImages) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previews.push(e.target.result);
      reader.readAsDataURL(image);
    }
  }

  removeImage(index: number) {
    this.previews.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }

  submit(formData: any) {
    let fd = formData.value;
    if(!fd.tandc) {
      this.toastr.error("agree to terms first");
      return;
    }
    let quantity = fd.quantity;
    quantity = parseInt(quantity);
    if(quantity <= 0) {
      this.toastr.error("Quantity is not valid");
      return;
    }
    const formdata = new FormData();
    formdata.append('product_name', fd.product_name);
    formdata.append('quantity', fd.quantity);
    formdata.append('units', fd.units);
    formdata.append('description', fd.description);
    formdata.append('device_type', "0");
    formdata.append('business_card_details', fd.supplier_business ? 'true' : 'false');
    formdata.append('tandc', fd.tandc);
    if(this.dataObject.type == "create" && this.dataObject.obj.category_id) {
      formdata.append('category', this.dataObject.obj.category_id);
    }
    if(this.dataObject.type == "update") {
      const filesNames = ['file1', 'file2', 'file3'];
      for(let i = 0; i < this.selectedImages.length; i++) {
        formdata.append(filesNames[i], this.selectedImages[i]);
      }
      formdata.append('rfq_id', this.dataObject.obj.id || this.dataObject.obj.pk_rfq_id);
      this.rfqUpdate(formdata);
    } else {
      this.selectedImages.forEach((image, index) => {
        formdata.append('image[]', image, `image${index}.jpg`);
      })
      if(this.verified) {
        formdata.append('mobile', this.mobileNumber.toString());
        this.rfqSubmitWithoutSignin(formdata);
      } else {
        this.rfqSubmit(formdata);
      }
    }
  }

  rfqSubmit(formdata: any) {
    this.rfqService.rfqSubmitV2(formdata).subscribe({
      next: (res: any) => {
        if (res.status == 200 ) {
          // this.openConfirmation();
          this.closeRFQpopup();
          this.router.navigateByUrl("/rfq-submission");
        }
        else if(res.status == 401) {
          this.logout('Your account was deleted');
        }
        else this.toastr.warning(res.message);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message);
        console.log(err.error);
      }
    });
  }

  rfqSubmitWithoutSignin(formdata: any) {
    this.rfqService.rfqSubmitV3(formdata).subscribe({
      next: (res: any) => {
        if (res.status == 200 ) {
          // this.openConfirmation();
          this.closeRFQpopup();
          localStorage.setItem('accountExists', "true");
          this.router.navigateByUrl("/rfq-submission");
        }
        else if(res.status == 201) {
          this.closeRFQpopup();
          localStorage.setItem('r-mobile', this.mobileNumber.toString());
          localStorage.setItem('r-token', res.token ?? this.mobileNumber.toString());
          localStorage.setItem('accountExists', "false");
          this.router.navigateByUrl("/rfq-submission");
        }
        else this.toastr.warning(res.message);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message);
        console.log(err.error);
      }
    });
  }

  rfqUpdate(formdata: any) {
    this.rfqService.updateRfqDetails(formdata).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.closeRFQpopup();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.toastr.error(err.message)
      }
    });
  }

  // Thank you template
  @ViewChild('thankyoutemplate') thankyoutemplate!: TemplateRef<any>;
  thankyouDialogRef!: MatDialogRef<any, any>;
  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '500px',
      disableClose: true,
    });

    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
      this.closeRFQpopup();
    });
  }
  closeThankYou = () => this.thankyouDialogRef.close();

  // Rfq Terms template
  @ViewChild('rfqTerms') rfqTerms!: TemplateRef<any>;
  termsDialogRef!: MatDialogRef<any, any>;
  openTermsDialog(event: Event): void {
    event.stopPropagation();
    this.termsDialogRef = this.dialog.open(this.rfqTerms, {
      width: '650px',
    });
    this.termsDialogRef.afterClosed().subscribe(() => {});
  }
  closeTerms = () => this.termsDialogRef.close();

  closeRFQpopup = () => this.dialogRef.close();



  // if not signed in
  isSignedIn = false;
  verified = false;
  mobileNumber = 0;
  submitV2() {
    if(!this.verified) {
      return;
    } else {
      this.submit(this.form);
    }
  }

  saveMobile(mobile: number) {
    this.verified = true;
    this.mobileNumber = mobile;
  }

  generateTxt = 'Generate';
  aiLoader = false;
  getChatGPTDescription() {
    let fd = this.form.value;
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
          this.generateTxt = 'Regenerate'
          let str = res.data;
          this.form.patchValue({
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
}