import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, HomeRoutingModule } from './home-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { Home2Component } from './home2/home2.component';
import { TopSupplierTypeComponent } from './top-supplier-type/top-supplier-type.component';
import { RegionManufactureComponent } from './region-manufacture/region-manufacture.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TopSupplierComponent } from './top-supplier/top-supplier.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BannerEffects } from './effects/banner.effects';
import { todoReducer } from '../shared/reducers/todo.reducer';
import { TodoEffects } from '../shared/effects/todo.effects';
import { bannerReducer } from './reducers/banner.reducer';
import { HomeBannerV3Component } from './home-banner-v3/home-banner-v3.component';




@NgModule({
  declarations: [
    components,
    Home2Component,
    TopSupplierTypeComponent,
    RegionManufactureComponent,
    HomeBannerV3Component,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    LayoutModule,
    NgxPaginationModule,
    StoreModule.forFeature('banner', bannerReducer),
    EffectsModule.forFeature([BannerEffects])
  ],
  exports: [
    components,
    NgxPaginationModule,
    TopSupplierTypeComponent
  ]
})
export class HomeModule { }
