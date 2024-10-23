import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shared, SharedRoutingModule } from './shared-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AuthGuard } from './services/auth.guard';


import { MatNativeDateModule } from '@angular/material/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PickerComponent} from '@ctrl/ngx-emoji-mart';
import { RfqHomeComponent } from './components/rfq/rfq-home/rfq-home.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { LottieModule } from 'ngx-lottie';
import { ErrorPageComponent } from './error-page/error-page.component';
import { EventPopupComponent } from './components/event-popup/event-popup.component';
import { RfqNewComponent } from './components/rfq/rfq-new/rfq-new.component';
import { ConfirmMobileComponent } from './components/rfq/confirm-mobile/confirm-mobile.component';
import { EnquiryNewComponent } from './components/enquiry-new/enquiry-new.component';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { DeletePopupConfirmComponent } from './components/delete-popup-confirm/delete-popup-confirm.component';
import { EnquiryMultipleComponent } from './components/enquiry-multiple/enquiry-multiple.component';
import { RfqDmComponent } from './components/rfq-dm/rfq-dm.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';


export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    shared,
    RfqHomeComponent,
    EnquiryComponent,
    ErrorPageComponent,
    EventPopupComponent,
    RfqNewComponent,
    ConfirmMobileComponent,
    EnquiryNewComponent,
    AlphaNumericDirective,
    DeletePopupConfirmComponent,
    EnquiryMultipleComponent,
    RfqDmComponent,
    WebcamComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MdbCarouselModule,
    MdbCollapseModule,
    SharedRoutingModule,
    CarouselModule,
    MatNativeDateModule,
    PickerComponent,
    LazyLoadImageModule,
    WebcamModule,
  //  PickerModule,
   // LazyLoadImagesModule,
    LottieModule.forRoot({ player: playerFactory })
  ],

  exports: [
    shared,
    FormsModule,
    ReactiveFormsModule,
    MdbCarouselModule,
    MdbCollapseModule,
    MaterialModule,
    CarouselModule,
    PickerComponent,
    LazyLoadImageModule,
    WebcamModule,
    WebcamComponent,
   // PickerModule,
   // LazyLoadImagesModule,
  ],
  providers: [AuthGuard],
})
export class SharedModule {}
