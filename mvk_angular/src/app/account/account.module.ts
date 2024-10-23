import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { LayoutModule } from '../layout/layout.module';
import { RfqViewDetailsComponent } from './rfq-view-details/rfq-view-details.component';
import { AccountHomeComponent } from './account-home/account-home.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { ContactInfoComponent } from './account-profile/contact-info/contact-info.component';
import { ConversationProfileComponent } from './conversation-profile/conversation-profile.component';
import { RfqQuotationDetailsComponent } from './rfq-quotation-details/rfq-quotation-details.component';
import { CloseReasonsComponent } from './view-details/close-reasons/close-reasons.component';
import { InquiriesListComponent } from './inquiries-list/inquiries-list.component';
import { RfqListComponent } from './rfq-list/rfq-list.component';
import { RfqlistDetailsComponent } from './view-details/rfqlist-details/rfqlist-details.component';
import { MaterialModule } from '../shared/material/material.module';
import { CompanyInfoComponent } from './account-profile/company-info/company-info.component';
import { BasicDetailsComponent } from './account-profile/basic-details/basic-details.component';
import { SourcingInfoComponent } from './account-profile/sourcing-info/sourcing-info.component';

import { AddressInfoComponent } from './account-profile/address-info/address-info.component';
import { StatutoryComponent } from './account-profile/statutory/statutory.component';
import { IntelletualComponent } from './account-profile/intelletual/intelletual.component';
import { AttachmentsComponent } from './account-profile/attachments/attachments.component';
import { NotesComponent } from './rfq-view-details/notes/notes.component';
import { AccountProfileV2Component } from './account-profile/account-profile-v2/account-profile-v2.component';
import { Mobilev2Component } from './account-profile/mobilev2/mobilev2.component';
import { AuthenticationModule } from '../authentication/authentication.module';
import { EmailV2Component } from './account-profile/email-v2/email-v2.component';
import { RfqDraftComponent } from './view-details/rfq-draft/rfq-draft.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { AssistChatComponent } from './assist-chat/assist-chat.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuoteCloseReasonsComponent } from './rfq-view-details/quote-close-reasons/quote-close-reasons.component';
// import { UpdateEmailComponent } from './account-profile/account-profile-v2/update-email/update-email.component';
import { SchoolProfileComponent } from './account-profile/school-profile/school-profile.component';
import { OtpInputComponent } from './account-profile/account-profile-v2/otp-input/otp-input.component';
import { MobileOtpComponent } from './account-profile/account-profile-v2/mobile-otp/mobile-otp.component';
import { AccountProfileV3Component } from './account-profile/account-profile-v3/account-profile-v3.component';
import { UpdateEmailComponent } from './account-profile/account-profile-v3/update-email/update-email.component';
import { OtpVerifyPopupComponent } from './account-profile/account-profile-v2/otp-verify-popup/otp-verify-popup.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductCompareComponent } from './wishlist/product-compare/product-compare.component';
import { ProductWishlistComponent } from './wishlist/product-wishlist/product-wishlist.component';
import { CompanyWishlistComponent } from './wishlist/company-wishlist/company-wishlist.component';
import { DeleteDialogComponent } from './wishlist/delete-dialog/delete-dialog.component';
import { WishlistShareViewComponent } from './wishlist/wishlist-share-view/wishlist-share-view.component';
import { WishlistShareEditComponent } from './wishlist/wishlist-share-edit/wishlist-share-edit.component';
import { WishlistShareInviteComponent } from './wishlist/wishlist-share-invite/wishlist-share-invite.component';

@NgModule({
  declarations: [
    AccountComponent,
    MenubarComponent,
    MainChatComponent,
    ViewDetailsComponent,
    RfqViewDetailsComponent,
    AccountHomeComponent,
    AccountProfileComponent,
    ContactInfoComponent,
    ConversationProfileComponent,
    RfqQuotationDetailsComponent,
    CloseReasonsComponent,
    InquiriesListComponent,
    RfqListComponent,
    RfqlistDetailsComponent,
    CompanyInfoComponent,
    BasicDetailsComponent,
    SourcingInfoComponent,
    AddressInfoComponent,
    StatutoryComponent,
    IntelletualComponent,
    AttachmentsComponent,
    NotesComponent,
    AccountProfileV2Component,
    Mobilev2Component,
    EmailV2Component,
    RfqDraftComponent,
    NotificationListComponent,
    AssistChatComponent,
    QuoteCloseReasonsComponent,
    UpdateEmailComponent,
    SchoolProfileComponent,
    OtpInputComponent,
    MobileOtpComponent,
    AccountProfileV3Component,
    OtpVerifyPopupComponent,
    WishlistComponent,
    ProductCompareComponent,
    ProductWishlistComponent,
    CompanyWishlistComponent,
    DeleteDialogComponent,
    WishlistShareViewComponent,
    WishlistShareEditComponent,
    WishlistShareInviteComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    LayoutModule,
    AccountRoutingModule,
    NgxPaginationModule
  ]
})
export class AccountModule { }
