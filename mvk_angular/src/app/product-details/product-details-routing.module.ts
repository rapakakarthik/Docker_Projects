import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import ProductDetailsComponent from './product-details.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { ProductViewComponent } from './product-view/product-view.component';
import { SupplierCompareComponent } from './supplier-compare/supplier-compare.component';
import { RelatedSupplierComponent } from './related-supplier/related-supplier.component';

const routes: Routes = [
  { path: 'suppliers/:id', component: SupplierCompareComponent },
  { path: 'related-suppliers/:id', component: RelatedSupplierComponent },
  { path: ':id', component: ProductDetailsComponent},
  { path: 'view/:id', component: ProductViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailsRoutingModule { }
