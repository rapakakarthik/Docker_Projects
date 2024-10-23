import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { Unit } from '../models/units';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { EnquiryFormOne } from '../models/enquiry-form-one';
import { Package, ProductDetails } from '../models/product';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent implements OnInit{
  @Input() productDetails!: ProductDetails
  @Input() packageDetails!: Package
  @Input() frequentlyBought!: any
  @Input() popularProducts!: any
  @Input() viewOnly: boolean = false;

  constructor(private elementRef: ElementRef, 
    private fb: FormBuilder, 
    private auth: AuthenticationService,
    private rfqService: RfqService,
    private toastr: ToastrService
    ) {
    if(this.isSignIn) {
      this.createSupplierForm();
    }
  }
  ngOnInit(): void {
    this.getAllDoprdowns();
  }
  

  supplierForm!: FormGroup;
  isSignIn = this.auth.isLoggedIn();
  createSupplierForm() {
    this.supplierForm = this.fb.group({
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      units: ['', Validators.required]
    })
  }

  units: Unit[] = [];
  getAllDoprdowns() {
    this.rfqService.getAlldropdownData('2').subscribe({
      next: (r) => {
        if (r.status == 200) {
          let res = r.data;
          this.units = res.units;
          if(!!this.productDetails && !!this.productDetails.unit_type) {
            let id = this.units.find(obj=>obj.val==this.productDetails.unit_type)?.id;
            this.supplierForm.patchValue({units: id});
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('get all dropdown', err.message)
      },
    });
  }


  submitForm() {
    let pd = this.productDetails;
    let fd = this.supplierForm.value;
    // let sd = this.productDetails.seller_company;
    let payload: EnquiryFormOne = {
      company_id: pd.account_id,
      seller_id: pd.seller_id,
      buyer_id: this.auth.getBuyerId(),
      category_id: pd.category_id,
      product_id: pd.id,
      enquery_type: 'product',
      product_name: pd.name,
      quantity: fd.quantity,
      units: fd.units,
      description: fd.description,
      screen: 'screen1',
    }
    this.enquerySubmit(payload);
  }

  enquerySubmit(submitData: any) {
    this.rfqService.enquerySubmitV2(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success("Submit Form Successfully");        
          this.supplierForm.reset();
          this.supplierForm.markAsUntouched();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message)
        console.error("Inquiry form submit: " + error.message)
      }
    });
  }

  scrollTo(id: string) {
    const element = this.elementRef.nativeElement.querySelector('#' + id);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.scrollY - 158;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  currentSectionInView: string = '';
  @HostListener('window:scroll', ['$event'])
  checkSectionInView() {
    const scrollPosition = window.scrollY;
    const sections = this.elementRef.nativeElement.querySelectorAll('.section');
    sections.forEach((section: HTMLElement) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - 158;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        this.currentSectionInView = section.id;
      }
    });
  }
}
