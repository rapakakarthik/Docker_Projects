import {Component, inject, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {  FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { RfqService } from '../../services/rfq.service';
import {  MatDialog,  MatDialogRef,  MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MutipleObj, SelectedProduct, SelectedSupplier } from 'src/app/account/wishlist/wishlist.component';

@Component({
  selector: 'app-enquiry-multiple',
  templateUrl: './enquiry-multiple.component.html',
  styleUrl: './enquiry-multiple.component.scss'
})
export class EnquiryMultipleComponent implements OnInit {

  private fb = inject(FormBuilder);
  private rfqService = inject(RfqService);
  
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EnquiryMultipleComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public mutipleObj: MutipleObj
  ) {
    this.setForm();
  }

  form!: FormGroup;
  ngOnInit(): void {
    // this.getAllDoprdowns();
    this.setMutlipleData(this.mutipleObj)
  }

  required = Validators.required;
  setForm() {
    this.form = this.fb.group({
      product_name: ['', this.required],
      // quantity: ['', this.required],
      // units: ['', this.required],
      description: [''],
      // quote_from_others: ['']
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
    // const sd = this.sellerDetails;
    let str = this.products.map(product => product.id).join(",");
    let submitData: MutipleEnquiryApiReq = {
     enquery_type: "product",
     device_type: 2,
     product_id: str,
     description: fd.description,
    //  quantity: fd.quantity,
    //  units: fd.units
    };
    if(this.mutipleObj.type == "seller") {
      let strS = this.suppliers.map(suppler => suppler.id).join(",");
      submitData.enquery_type = "company";
      submitData.product_name = fd.product_name;
      submitData.seller_id = strS;
      submitData.product_id = "";
    };
    // console.log(submitData)
    this.enquerySubmit(submitData);
  }
  
  enquerySubmit(submitData: MutipleEnquiryApiReq) {
    this.rfqService.multipleEnquiry(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.openConfirmation();
        } else {
          this.toastr.warning(res.message);
          console.warn(res.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message)
        console.error("multi Inquiry form submit: " + error.message)
      }
    });
  }

  // get Description() {
  //   return this.form.get('description');
  // }

  // qactive: string = "";
  // description: string = "";
  // addSentenceToDescription(sentence: string) {
  //   let index = this.description.indexOf(sentence);
  //   if(index >= 0) {
  //     let desc = this.description.split("");
  //     desc.splice(index, sentence.length + 1);
  //     this.description = desc.join("")
  //   } else {
  //     this.description = this.description + sentence + "\n"
  //   }
  //   // this.description = this.Description?.value +  sentence + '\n' 
  //   this.form.patchValue({
  //     description: this.description
  //   })

  //   this.qactive = sentence;
  // }


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


  // Multiple enquiry code 
  setMutlipleData(data: MutipleObj) {
    if(this.mutipleObj.type === "product") {
      this.productEnquiry = true;
      this.form.removeControl('product_name');
      this.products = this.mutipleObj.products;
      this.suppliers = this.mutipleObj.suppliers;
    }else {
      this.productEnquiry = false;
      this.suppliers = this.mutipleObj.suppliers;
    }
  }
  productEnquiry = false;

  suppliers: SelectedSupplier[] = []

  products: SelectedProduct[] = []

  // Suppliers code 
  removeSupplier(id: number) {
    let index = this.suppliers.findIndex(supplier => supplier.id === id);
    this.suppliers.splice(index, 1);
  }

  // Products code 
  removeProduct(id: number) {
    let index = this.products.findIndex(product => product.id === id);
    this.suppliers.splice(index, 1);
    this.products.splice(index, 1);
  }
}

export interface MutipleEnquiryApiReq {
  enquery_type: "company" | "product",
  device_type: 2,
  product_id: string,
  quantity?: number,
  seller_id?: string,
  product_name?: string,
  description: string,
  units?: string
}