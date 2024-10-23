import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { BannerComponent } from './banner/banner.component';
import { CategorymenuComponent } from './categorymenu/categorymenu.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LayoutComponent } from './layout.component';
import { MenuComponent } from './menu/menu.component';
import { TopheaderComponent } from './topheader/topheader.component';
import { FavProductComponent } from './fav-product/fav-product.component';
import { RegionBannerComponent } from './region-banner/region-banner.component';
import { ErrorPageComponent } from '../shared/error-page/error-page.component';
import { WishlistShareInviteComponent } from '../account/wishlist/wishlist-share-invite/wishlist-share-invite.component';
import { WishlistShareViewComponent } from '../account/wishlist/wishlist-share-view/wishlist-share-view.component';

const routes: Routes = [


  // { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: '', component: LayoutComponent, children: [
      // { path: 'error', component: ErrorPageComponent },
      // {path: 'buyer-dashboard/saved-products', component: FavProductComponent},
      // {path:  'manufactures', loadChildren:() => import('../manufacture/manufacture.module').then(m => m.ManufactureModule)},
      { path: 'wishlist-invite/:token', component: WishlistShareInviteComponent, canActivate: [AuthGuard] },
      { path: 'wishlist-view/:type/:token', component: WishlistShareViewComponent },
      { path: 'searchresults/:keyword/:type', loadChildren: () => import('../search-results/search-results.module').then(m => m.SearchResultsModule) },
      { path: 'category', loadChildren: () => import('../category/category.module').then(m => m.CategoryModule)},
      { path: 'recommendations', loadChildren: () => import('../recommendation/recommendation.module').then(m => m.RecommendationModule)},
      { path: 'product', loadChildren: () => import('../product-details/product-details.module').then(m => m.ProductDetailsModule)},
      { path: 'company/:id', loadChildren: () => import('../company/company.module').then(m => m.CompanyModule)},
      { path: '', loadChildren: () => import('../home/home.module').then(m => m.HomeModule) },
    ]
  },
  { path: '**', loadChildren: () => import('../notfound/notfound.module').then(m => m.NotfoundModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

export const layout: any[] = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent,
  ContentComponent,
  LandingPageComponent,
  TopheaderComponent,
  MenuComponent,
  BannerComponent,
  CategorymenuComponent,
  HomeBannerComponent,
  FavProductComponent,
  RegionBannerComponent,
  
]
