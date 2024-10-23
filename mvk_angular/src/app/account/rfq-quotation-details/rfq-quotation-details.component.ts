import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-rfq-quotation-details',
  templateUrl: './rfq-quotation-details.component.html',
  styleUrls: ['./rfq-quotation-details.component.scss'],
})
export class RfqQuotationDetailsComponent implements OnInit{

  private crud = inject(CrudService);

  @Input({required: true}) id: number = 0;
  @Output() hide = new EventEmitter();

  constructor() {}
  ngOnInit(): void {
    this.getProductDetails();
  }

  productDetails: any;
  companyDetails: any;
  shippingDetails: any;
  productImages: any;
  sellerId: any;
  getProductDetails() {
    this.crud.getProductDetilsV2(this.id).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.productDetails = {
            ...res.data.product_details,
            ...res.data.key_attributes,
          }
          this.companyDetails = res.data.company_details;
          this.shippingDetails = res.data.packaging_and_delivery.shipping;
          let images = res.data?.product_all_images;
          this.productImages = images.original_images;
          this.sellerId = this.productDetails.seller_id;
        } else {
          this.productDetails = null;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      },
    });
  }

  close() {
    this.hide.emit();
  }
}
