import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RfqService } from '../../services/rfq.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryComponent } from './category/category.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss'],
})
export class RfqComponent implements OnInit {
  form!: FormGroup;
  unitdetails: any;
  categoryList: any;
  @ViewChild('categorytemplate')
  categorytemplate!: TemplateRef<any>;

  @ViewChild('thankyoutemplate')
  thankyoutemplate!: TemplateRef<any>;
  @ViewChild('rfqTerms')
  rfqTerms!: TemplateRef<any>;

  categoryDialogRef: any;
  selectedSubcategories: any;
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

  termsDialogRef: any;

  @ViewChild('keyInput') keyInput: ElementRef<HTMLInputElement> | undefined;
  thankyouDialogRef: any;
  constructor(
    public dialogRef: MatDialogRef<RfqComponent>,
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
    // if(this.dataObject && (this.dataObject?.type ===  "update" || this.dataObject?.type === "post again")) {
    //   this.updateForm(this.dataObject.data)
    // }
    // if(this.dataObject) {
    //   this.form.patchValue({
    //   product_name: this.dataObject.name,
    //     quantity: this.dataObject.quantity,
    //     units: this.dataObject.units,
    //   });
    // }
  }

  createRfqForm() {
    this.form = this.fb.group({
      product_name: ['', Validators.required],
      category: [''],
      sourcing_type: ['', Validators.required],
      supplier_business: [''],
      packaging_type: [''],
      valid_to: [''],
      quantity: ['', Validators.required],
      units: ['', Validators.required],
      description: [''],
      order_value: [''],
      currency: [''],
      lead_time: [''],
      required_frequency: [''],

      keywords: [''],
      tandc: ['', Validators.required],

      //further_specified_details
      //category_related_attributes
      //company_id
      //seller_id
      //buyer_id
      //product_id
      //enquery_type
      //further_specify_details
      //agree_to_terms
      //attributes
    });
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !d || d >= today;
  };

  updateForm(data: any) {
    this.catName = data.category_id ?? data.category;
    const unitId = this.units.filter(obj => obj.val == data.units);
    if(unitId.length == 0) {
      this.form.patchValue({
        units: data.units,
      })
    } else {
      this.form.patchValue({
        units: unitId[0].id,
      })
    }
    // console.log(unitId);
    this.form.patchValue({
      quantity: data.quantity,
      product_name: data.product_name,
      category: data.category_id,
      sourcing_type: data.sourcing_type,
      supplier_business: data.supplier_business,
      packaging_type: data.packaging_type,
      valid_to: data.valid_to,
      // units: unitId[0].id,
      description: data.description,
      order_value: data.order_value,
      currency: data.currency,
      lead_time: data.lead_time,
      required_frequency: data.required_frequency,
      keywords: data.keywords,
      tandc: true,
    })
  }

  getAttributeslist(id: any) {
    this.rfqService.getAttributes(id).subscribe((res) => {
      if (res.status == 200) {
        this.attrData = res.data;
        this.myMethod(res.data);
      }
      if (res.status == 400 && res.message == 'Unauthorized') {
        this.toastr.info('Session Expires Login Again')
        localStorage.removeItem('token');
        localStorage.removeItem('userObj');
        this.dialogRef.close();
        this.router.navigate(['/signin']);
      }
    });
  }

  selectedImages: File[] = [];
  image1!: File;
  image2!: File;
  image3!: File;
  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
    this.selectedImages = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      if(i <= 2) {
        this.selectedImages.push(selectedFiles[i]);
      }
    }
    this.image1 = event.target.files[0];
    this.image2 = event.target.files[1];
    this.image3 = event.target.files[2];
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
      reader.onload = (e: any) => {
        this.previews.push(e.target.result);
      };
      reader.readAsDataURL(image);
    }
  }

  myMethod(attData: any) {
    attData.forEach((dat: any) => {
      this.form.addControl(dat.name, new FormControl(''));
    });
  }
  // getCategories() {
  //   this.rfqService.getCategories('').subscribe(res => {
  //     if (res.status == 200) {
  //      this.categoryList=res.data;

  //     }
  //     else {
  //       this.unitdetails = {}
  //     }
  //   })
  // }

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
        if(this.dataObject && (this.dataObject?.type ===  "update" || this.dataObject?.type === "post again")) {
          this.updateForm(this.dataObject.data)
        }
      } else if (r.status == 400) {
        this.toastr.info('Session Expires Login Again')
        localStorage.removeItem('token');
        localStorage.removeItem('userObj');
        this.dialogRef.close();
        this.router.navigate(['/signin'])
      }
    });
  }

  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '350px',
      disableClose: true,
    });

    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
      this.dialogRef.close();
    });

    setTimeout(() => {
      this.thankyouDialogRef.close();
    }, 6000);
  }

  openCategorypopup() {
    this.categoryDialogRef = this.dialog.open(this.categorytemplate, {
      width: '550px',
      data: this.categories,
    });

    this.categoryDialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.selectedCategories = res;
        this.catName = this.selectedCategories.name;

        this.form.controls['category'].setValue(this.catName);
        // this.getAttributeslist(this.selectedCategories.id);
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
        console.log(content)
        this.htmlContent = content;
      },
      error: (error: HttpErrorResponse) => {
        this.htmlContent = error.error.text;
        console.error('Failed to fetch RFQ terms and conditions:', error);
      }
    })
  }

  closeCategorypopup() {
    this.categoryDialogRef.close();
  }
  closeRFQpopup() {
    this.dialogRef.close();
  }

  closeTerms() {
    this.termsDialogRef.close();
  }

  closeThankYou() {
    this.thankyouDialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
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

  createFormObject(formData: any): any {
    const customJson = {
      // Add properties to the custom JSON object here
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      // Add additional properties as needed
    };

    return customJson;
  }

  // myMethod(attData: any) {
  //   attData.forEach((dat: any) => {
  //     this.form.addControl(dat.name, new FormControl(''));
  //   })
  // }

  submit(formData: any) {
    let fd = formData.value;
    let attrnames: any = [];

    if(this.attrData) {
      this.attrData.forEach((dat: any) => {
        attrnames.push({ name: dat.name, type: dat.type, value: fd[dat.name] });
      });
    }


    const date = new Date(fd.valid_to);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
  
    const formdata = new FormData();
    const filesNames = ['file1', 'file2', 'file3'];
    for(let i = 0; i < this.selectedImages.length; i++) {
      formdata.append(filesNames[i], this.selectedImages[i]);
    }
    formdata.append('attribute', attrnames);
    formdata.append('category', fd.category);
    formdata.append('currency', fd.currency);
    formdata.append('description', fd.description);
    // formdata.append('file1', this.image1);
    // formdata.append('file2', this.image2);
    // formdata.append('file3', this.image3);
    formdata.append('keywords', fd.keyword);
    formdata.append('lead_time', fd.lead_time);
    formdata.append('order_value', fd.order_value);
    formdata.append('packaging_type', fd.packaging_type);
    formdata.append('product_name', fd.product_name);
    formdata.append('quantity', fd.quantity);
    formdata.append('required_frequency', fd.required_frequency);
    formdata.append('sourcing_type', fd.sourcing_type);
    formdata.append('supplier_business', fd.supplier_business);
    formdata.append('tandc', "1");
    formdata.append('units', fd.units);
    formdata.append('valid_to', formattedDate);
    
    if(this.dataObject && this.dataObject.type === "update") {
      formdata.append('rfq_id', this.dataObject.data.id);
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
    } else {
      this.rfqService.reqSubmit(formdata).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.openConfirmation();
          }else {
            this.toastr.warning(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.message);
          console.log(err.error);
        }
      });
    }
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
