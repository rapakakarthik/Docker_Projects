import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { HometabsComponent } from './hometabs/hometabs.component';
import { ManufacturesTabComponent } from './manufactures-tab/manufactures-tab.component';
import { MfgDescComponent } from './mfg-desc/mfg-desc.component';
import { MfgListComponent } from './mfg-list/mfg-list.component';
import { ProductsTabComponent } from './products-tab/products-tab.component';
import { QuotebannerComponent } from './quotebanner/quotebanner.component';
import { TopProductComponent } from './top-product/top-product.component';
import { TopSupplierComponent } from './top-supplier/top-supplier.component';
import { RfqInfoComponent } from '../shared/components/rfq-info/rfq-info.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { FavProductComponent } from '../layout/fav-product/fav-product.component';
import { Home2Component } from './home2/home2.component';
import { ProductRecommendationComponent } from '../recommendation/product-recommendation/product-recommendation.component';
import { ManufactureRecommendationComponent } from '../recommendation/manufacture-recommendation/manufacture-recommendation.component';
import { RegionManufactureComponent } from './region-manufacture/region-manufacture.component';

const routes: Routes = [
  // { path: 'rfqinfo', component: RfqInfoComponent },
  { path: 'topproduct', component: TopProductComponent },
  { path: 'topmanufacture', component: TopSupplierComponent },
  { path: 'products/fav', component: FavProductComponent, canActivate: [AuthGuard] },
  // {path: 'new', component: HomeComponent, children:[
  //   { path: '', component: ProductsTabComponent},
  // ]},
  {path: 'region/:id', component: RegionManufactureComponent},
  { path: 'products/:category_id/:viewtype', loadChildren: () => import('../product-listing/product-listing.module').then(m => m.ProductListingModule)},
  { path: 'products/:category_id', loadChildren: () => import('../product-listing/product-listing.module').then(m => m.ProductListingModule) },
  { path: '', component: Home2Component, children: [
      { path: 'products', component: ProductRecommendationComponent},
      { path: 'manufacture', component: ManufactureRecommendationComponent},
      { path: "", component: ProductRecommendationComponent}
    ],
  },
  { path: '**', loadChildren: () => import('../notfound/notfound.module').then(m => m.NotfoundModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

export const components = [
  HometabsComponent,
  HomeComponent,
  ProductsTabComponent,
  ManufacturesTabComponent,
  QuotebannerComponent,
  MfgListComponent,
  MfgDescComponent,
  TopProductComponent,
  TopSupplierComponent,
];
