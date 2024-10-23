import { Component, ElementRef, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { text } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-rfq-home',
  templateUrl: './rfq-home.component.html',
  styleUrls: ['./rfq-home.component.scss']
})
export class RfqHomeComponent implements OnInit {
  form!: FormGroup;
  unitdetails: any;
  categoryList: any;
  @ViewChild('categorytemplate')
  categorytemplate!: TemplateRef<any>;

  @ViewChild('rfqTerms')
  rfqTerms!: TemplateRef<any>;

  categoryDialogRef: any;
  // selectedSubcategories: any;
  sourceType: any;
  units: any[] = [];
  currency: any;
  frequency: any;
  businessType: any;
  questions: any;
  orderval: any;
  categories: any;
  selectedCategories: any;
  showChildren = false;
  catName: any = 'Select Category';
  attrData: any;
  keywordsList: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  submitData: any;
  termsDialogRef: any;

  @ViewChild('keyInput') keyInput: ElementRef<HTMLInputElement> | undefined;
  constructor(
    public dialogRef: MatDialogRef<RfqHomeComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dataObject: any,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.createRfqForm();
    this.getAllDoprdowns();
  }

  createRfqForm() {
    this.form = this.fb.group({
      product_name: ['', Validators.required],
      category: ['',],
      quantity: ['', Validators.required],
      units: ['', Validators.required],
      other_category: [''],
      tandc: ['', Validators.required],
      description: [''],

      sourcing_type: [''],
      supplier_business: [''],
      packaging_type: [''],
      valid_to: [''],
      order_value: [''],
      currency: [''],
      lead_time: [''],
      required_frequency: [''],
    });
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !d || d >= today;
  };

  categoryLoader: boolean = false;
  getAllDoprdowns() {
    this.categoryLoader = true;
    this.rfqService.getAlldropdownData('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.categoryLoader = false;
        this.businessType = res.business_type;
        this.currency = res.currency;
        this.frequency = res.frequency;
        this.orderval = res.order_val;
        this.questions = res.questions;
        this.sourceType = res.sourcing_type;
        this.units = res.units;
        this.categories = res.categories;
        // if(this.dataObject && (this.dataObject?.type ===  "update" || this.dataObject?.type === "post again")) {
        //   this.updateForm(this.dataObject.data)
        // }
      } else if (r.status == 400) {
        this.toastr.info('Session Expires Login Again')
        localStorage.removeItem('token');
        localStorage.removeItem('userObj');
        this.dialogRef.close();
        this.router.navigate(['/signin'])
      }
    });
  }

  selectedImages: File[] = [];
  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
    this.selectedImages = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      if(i <= 2) {
        this.selectedImages.push(selectedFiles[i]);
      }
    }
    this.previewImage();
  }


  previews: string[] = [];
  previewImage() {
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


  @ViewChild('thankyoutemplate') thankyoutemplate!: TemplateRef<any>;
  thankyouDialogRef!: MatDialogRef<any, any>;
  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '500px',
      disableClose: true,
    });

    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
      this.dialogRef.close();
    });

    // setTimeout(() => {
    //   this.thankyouDialogRef.close();
    // }, 6000);
  }

  // After Clicked On Select Category opening category component
  openCategorypopup() {
    this.categoryDialogRef = this.dialog.open(this.categorytemplate, {
      width: '550px',
      data: this.categories,
    });

    this.categoryDialogRef.afterClosed().subscribe((res: any) => {
      if(res.type == 'others') {
        this.catName = res.value;
        this.form.controls['other_category'].setValue(res.value);
        this.form.controls['category'].setValue(0);
        return
      }
      else if (res.name) {
        // this.selectedCategories = res;
        this.catName = res.name;
        this.form.controls['category'].setValue(res.id);
        // this.getAttributeslist(res.id);
      } 
    });
  }
  
  openTermsDialog(event: Event): void {
    this.getRfqTerms();
    event.stopPropagation();
    this.termsDialogRef = this.dialog.open(this.rfqTerms, {
      width: '650px',
    });
    this.termsDialogRef.afterClosed().subscribe(() => {});
  }
  htmlContent: string = '';
  getRfqTerms() {
    this.rfqService.getRfqTerms().subscribe({
      next: (content: string) => {
        this.htmlContent = content;
      },
      error: (error: HttpErrorResponse) => {
        this.htmlContent = error.error.text;
        console.error('Failed to fetch RFQ terms and conditions:', error);
      }
    })
  }

  closeCategorypopup = () => this.categoryDialogRef.close();
  closeRFQpopup = () => this.dialogRef.close();
  closeTerms = () => this.termsDialogRef.close();
  closeThankYou = () => {
    this.thankyouDialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywordsList.push(value);
      this.form.controls['keyword'].setValue(this.keywordsList);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(kw: string): void {
    const index = this.keywordsList.indexOf(kw);
    if (index >= 0) {
      this.keywordsList.splice(index, 1);
    }
  }

  formNumber: number = 1;
  submit(formData: any) {
    let fd = formData.value;
    const formdata = new FormData();
    if(this.formNumber == 1) {
      formdata.append('category', fd.category);
      formdata.append('product_name', fd.product_name);
      formdata.append('quantity', fd.quantity);
      formdata.append('units', fd.units);
      formdata.append('description', fd.description);
      formdata.append('device_type', "0");
      if(fd.other_category) formdata.append('other_category', fd.other_category);
      this.rfqSubmit(formdata);
    } else {
      // if(this.dataObject && this.dataObject.type === "update") {
      // console.log(fd);
      formdata.append('category', fd.category);
      formdata.append('product_name', fd.product_name);
      formdata.append('quantity', fd.quantity);
      formdata.append('units', fd.units);
      formdata.append('description', fd.description);
      if(fd.other_category) formdata.append('other_category', fd.other_category);
      formdata.append('rfq_id', this.rfqResponse.pk_rfq_id);
      const date = new Date(fd.valid_to);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let formattedDate = `${year}-${month}-${day}`;
      const filesNames = ['file1', 'file2', 'file3'];
      for(let i = 0; i < this.selectedImages.length; i++) {
        formdata.append(filesNames[i], this.selectedImages[i]);
      }
      // formdata.append('attribute', attrnames);
      formdata.append('currency', fd.currency);
      formdata.append('keywords', fd.keyword);
      formdata.append('lead_time', fd.lead_time);
      formdata.append('order_value', fd.order_value);
      formdata.append('packaging_type', fd.packaging_type);
      formdata.append('required_frequency', fd.required_frequency);
      formdata.append('sourcing_type', fd.sourcing_type);
      formdata.append('supplier_business', fd.supplier_business);
      formdata.append('tandc', "1");
      formdata.append('valid_to', formattedDate);
      this.rfqUpdate(formdata)
    }
  }

  rfqResponse: any;
  unit: any
  rfqSubmit(formdata: any) {
    this.rfqService.rfqSubmitV2(formdata).subscribe({
      next: (res: any) => {
        if (res.status == 200 ) {
          if(this.formNumber === 1) this.formNumber++;
          this.rfqResponse = res.rfq;
          this.unit = this.units.find(value => value.id === this.rfqResponse.units);
        } else this.toastr.warning(res.message);
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
          this.openConfirmation();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.toastr.error(err.message)
      }
    });
  }

  showRfq: boolean = false;
  editRfq() {
    this.showRfq = true;
  }

  get Description() {
    return this.form.get('description');
  }
  description: string = ''
  addSentenceToDescription(sentence: string) {
    let index = this.description.indexOf(sentence);
    if(index >= 0) {
      let desc = this.description.split("");
      desc.splice(index, sentence.length + 1);
      this.description = desc.join("")
    } else {
      this.description = this.description + sentence + "\n"
    }
    // this.description = this.Description?.value +  sentence + '\n' 
    this.form.patchValue({
      description: this.description
    })
  }

}
