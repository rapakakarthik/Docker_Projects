import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {  FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { RfqService } from '../../services/rfq.service';
import {  MatDialog,  MatDialogRef,  MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enquiry-new',
  templateUrl: './enquiry-new.component.html',
  styleUrl: './enquiry-new.component.scss'
})
export class EnquiryNewComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EnquiryNewComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    @Inject(MAT_DIALOG_DATA) public sellerDetails: any
  ) {
    this.setForm();
  }

  showProductInput: boolean = true;
  form!: FormGroup;
  ngOnInit(): void {
    if(this.sellerDetails && this.sellerDetails.productName) {
      this.form.get('product_name')?.patchValue(this.sellerDetails.productName);
      this.showProductInput = false;
    }
    this.getAllDoprdowns();
  }

  required = Validators.required;
  setForm() {
    this.form = this.fb.group({
      product_name: ['', this.required],
      quantity: ['', this.required],
      units: ['', this.required],
      description: ['', this.required],
      quote_from_others: ['']
    });
  }
  
  units: any[] = [];
  questions: any[] = [];
  getAllDoprdowns() {
    this.rfqService.getAlldropdownData('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.questions = res.questions;
        this.units = res.units;
      }
    });
  }

  
  //Form Submit
  submit(formData: any) {
    let fd = formData.value;
    if(this.checkValidations(fd)) {
      return;
    }
    // saving for chat 
    this.description = fd.description

    const sd = this.sellerDetails;

    let submitData: SubmitData = {
      enquery_type: sd.env,
      product_name: fd.product_name,
      quantity: fd.quantity,
      seller_id: sd.sellerId,
      company_id: sd.sellerAccountId,
      product_id: 0,
      units: fd.units,
      quote_from_others: fd.quote_from_others ? 1 : 0,
      description: fd.description,
      device_type: 0
    };
    if(sd.product_id) submitData['product_id'] = sd.product_id;
    // console.log(submitData)
    this.enquerySubmit(submitData);
  }

  checkValidations(data: any): boolean {
    if(parseInt(data.quantity) <= 0) {
      this.toastr.error('Quantity Invalid');
      return true;
    }
    return false;
  }
  
  enquiryResponse: any;
  enquerySubmit(submitData: any) {
    this.rfqService.enquerySubmitV3(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.enquiryResponse = res.data;
          this.openConfirmation();
        } else {
          this.toastr.warning(res.message);
          console.warn(res.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message)
        console.error("Inquiry form submit: " + error.message)
      }
    });
  }

  get Description() {
    return this.form.get('description');
  }

  qactive: string = "";
  description: string = "";
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

    this.qactive = sentence;
    this.Description?.valueChanges.subscribe(v => {
      this.description = v;
    })
  }


  // dialog templates 
  thankyouDialogRef: any;
  @ViewChild('thankyoutemplate')
  thankyoutemplate!: TemplateRef<any>;
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

  closeInquirypopup = () => this.dialogRef.close();
  closeConfirmation = () => this.thankyouDialogRef.close();
}


interface SubmitData {
  enquery_type : 'product' | 'company',
  product_name: string,
  quantity : number,
  seller_id: number,
  company_id : number,
  product_id : number,
  units: string,
  quote_from_others: 1 | 0,
  description: string,
  device_type: 0
}