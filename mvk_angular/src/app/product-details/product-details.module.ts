import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import ProductDetailsComponent from './product-details.component';
import { SharedModule } from '../shared/shared.module';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BuyerReviewsComponent } from './buyer-reviews/buyer-reviews.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { SupplierCompareComponent } from './supplier-compare/supplier-compare.component';
import { RelatedSupplierComponent } from './related-supplier/related-supplier.component';



@NgModule({
  declarations: [
    ProductDetailsComponent,
    ProductDescriptionComponent,
    TransactionsComponent,
    BuyerReviewsComponent,
    ProductViewComponent,
    ImageViewComponent,
    SupplierCompareComponent,
    RelatedSupplierComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    SharedModule,
    NgxImageZoomModule,
    NgxGalleryModule,
  ]
})
export class ProductDetailsModule { }
