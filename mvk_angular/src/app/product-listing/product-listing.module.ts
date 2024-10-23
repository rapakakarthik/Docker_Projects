import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListingRoutingModule } from './product-listing-routing.module';
import { ProductListingComponent } from './product-listing.component';
import { FilterModule } from '../filter/filter.module';
import { MaterialModule } from '../shared/material/material.module';
import { MediaCardComponent } from './media-card/media-card.component';
import { HomeModule } from '../home/home.module';
import { LayoutModule } from '../layout/layout.module';


@NgModule({
  declarations: [
    ProductListingComponent,
    MediaCardComponent
  ],
  imports: [
    CommonModule,
    ProductListingRoutingModule,
    FilterModule,
    MaterialModule,
    LayoutModule,
    HomeModule
  ]
})
export class ProductListingModule{

 }
