import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardStyle2Component } from './components/card-style2/card-style2.component';
import { ChatNowComponent } from './components/chat-now/chat-now.component';
import { ContactsupplierComponent } from './components/contactsupplier/contactsupplier.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { ListCardComponent } from './components/list-card/list-card.component';
import { LogoComponent } from './components/logo/logo.component';
import { MultiCarouselComponent } from './components/multi-carousel/multi-carousel.component';
import { NodataComponent } from './components/nodata/nodata.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RegionComponent } from './components/region/region.component';
import { RfqCardComponent } from './components/rfq-card/rfq-card.component';
import { SigninCardComponent } from './components/signin-card/signin-card.component';
import { ViewNumberComponent } from './components/view-number/view-number.component';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { TextPipe } from './pipes/text.pipe';
import { CarouselComponent } from './components/carousel/carousel.component';
import { KeyvaluePipe } from './pipes/keyvalue.pipe';
import { ReviewComponent } from './components/review/review.component';
import { RfqInfoComponent } from './components/rfq-info/rfq-info.component';
import { ServerDownComponent } from './components/server-down/server-down.component';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { ChatWrapComponent } from './components/chat-wrap/chat-wrap.component';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { TabBannerComponent } from './components/tab-banner/tab-banner.component';
import { MultiBannerComponent } from './components/multi-banner/multi-banner.component';
import { SmallBannerComponent } from './components/small-banner/small-banner.component';
import { BigBannerComponent } from './components/big-banner/big-banner.component';
import { SchoolComponent } from './components/school/school.component';
import { GridBannerComponent } from './components/grid-banner/grid-banner.component';
import { EmailPopupComponent } from './components/email-popup/email-popup.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BannersComponent } from './components/banners/banners.component';
import { EnquiryV2Component } from './components/enquiry-v2/enquiry-v2.component';
import { CategoryComponent } from './components/rfq/category/category.component';
import { RfqComponent } from './components/rfq/rfq.component';
import { CategoryCarouselComponent } from './components/category-carousel/category-carousel.component';
import { ChunkPipe } from './pipes/chunk.pipe';
import { ZoomDirective } from './directives/zoom.directive';
import { InidanCurrencyPipe } from './pipes/inidan-currency.pipe';
import { AllowNumbersOnlyDirective } from './directives/allow-numbers-only.directive';
import { SafeImageDirective } from './directives/safe-image.directive';
import { RejectSpecialCharactersDirective } from './directives/reject-special-characters.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}

export const shared: any[] = [
  PageLoaderComponent,
  LogoComponent,
  ItemCardComponent,
  TextPipe,
  MultiCarouselComponent,
  ChatNowComponent,
  ViewNumberComponent,
  CardStyle2Component,
  ProductCardComponent,
  RegionComponent,
  SigninCardComponent,
  RfqCardComponent,
  ListCardComponent,
  NodataComponent,
  ContactsupplierComponent,
  ViewprofileComponent,
  SanitizePipe,
  KeyvaluePipe,
  InidanCurrencyPipe,
  CarouselComponent,
  ReviewComponent,
  RfqInfoComponent,
  ServerDownComponent,
  BannerCarouselComponent,
  ChatWrapComponent,
  RecommendationCardComponent,
  TabBannerComponent,
  MultiBannerComponent,
  SmallBannerComponent,
  BigBannerComponent,
  SchoolComponent,
  GridBannerComponent,
  EmailPopupComponent,
  PaginationComponent,
  BannersComponent,
  EnquiryV2Component,
  CategoryComponent,
  RfqComponent,
  CategoryCarouselComponent,
  ChunkPipe,
  ZoomDirective,
  AllowNumbersOnlyDirective,
  SafeImageDirective,
  RejectSpecialCharactersDirective,
  AlphaNumericDirective,
];
