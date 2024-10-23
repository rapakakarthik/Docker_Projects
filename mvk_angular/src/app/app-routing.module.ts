import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';

import { PrivacyPageComponent } from './custompages/privacy-page/privacy-page.component';
import { TermsPageComponent } from './custompages/terms-page/terms-page.component';
import { WelcomepageComponent } from './custompages/welcomepage/welcomepage.component';
import { DeleteAccountComponent } from './authentication/delete-account/delete-account.component';
import { CareersComponent } from './custompages/careers/careers.component';
import { AuthGuard } from './shared/services/auth.guard';
import { HelpComponent } from './custompages/help/help.component';
import { AboutComponent } from './custompages/about/about.component';
import { ContactComponent } from './custompages/contact/contact.component';
import { FaqComponent } from './custompages/faq/faq.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account/account-home/account-home.component';
import { CompanyInfoComponent } from './account/account-profile/company-info/company-info.component';
import { MainChatComponent } from './account/main-chat/main-chat.component';
import { RfqViewDetailsComponent } from './account/rfq-view-details/rfq-view-details.component';
import { ViewDetailsComponent } from './account/view-details/view-details.component';
import { BlogComponent } from './custompages/blog/blog.component';
import { BlogDetailsComponent } from './custompages/blog-details/blog-details.component';
import { AccountProfileV2Component } from './account/account-profile/account-profile-v2/account-profile-v2.component';
import { StoriesComponent } from './custompages/stories/stories.component';
import { StoriesDetailsComponent } from './custompages/stories-details/stories-details.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { ShippingComponent } from './custompages/shipping/shipping.component';
import { CancellationComponent } from './custompages/cancellation/cancellation.component';
import { NotificationListComponent } from './account/notification-list/notification-list.component';
import { AssistChatComponent } from './account/assist-chat/assist-chat.component';
import { RfqSubmissionComponent } from './account/rfq-submission/rfq-submission.component';
import { RfqQuoteComponent } from './account/rfq-quote/rfq-quote.component';
import { AccountProfileV3Component } from './account/account-profile/account-profile-v3/account-profile-v3.component';
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { ProductCompareComponent } from './account/wishlist/product-compare/product-compare.component';
import { RfqDmComponent } from './shared/components/rfq-dm/rfq-dm.component';
import { WishlistShareViewComponent } from './account/wishlist/wishlist-share-view/wishlist-share-view.component';


const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  // { path: 'banner', component: BannersComponent },
  { path: 'help', component: HelpComponent,  data: { title: 'Help'} },
  { path: 'error', component: ErrorPageComponent,  data: { title: 'Error'} },
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'faq', component: FaqComponent,  data: { title: 'Faq'} },
  { path: 'blog', component: BlogComponent,  data: { title: 'Blog'} },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: BlogDetailsComponent,  data: { title: 'Blog Details'} },
  { path: 'story', component: StoriesComponent,  data: { title: 'Stories'} },
  { path: 'story/:url/:id', component: StoriesDetailsComponent,  data: { title: 'Stories Details'} },
  { path: 'signup', component: SignupComponent },
  { path: 'privacy', component: PrivacyPageComponent, data: { title: 'Privacy Policy'} },
  { path: 'careers', component: CareersComponent, data: { title: 'Careers'} },
  { path: 'terms', component: TermsPageComponent, data: { title: 'Terms'}  },
  { path: 'shipterms', component: ShippingComponent, data: { title: 'Shipping Terms'}  },
  { path: 'refundterms', component: CancellationComponent, data: { title: 'Cancellation and Refund Terms'}  },
  { path: 'get-started', component: WelcomepageComponent },
  { path: 'delete-buyer-account', component: DeleteAccountComponent, canActivate: [AuthGuard] },
  { path: 'rfq-quote', component: RfqQuoteComponent },
  { path: 'rfq-dm', component: RfqDmComponent },
  { path: 'rfq-submission', component: RfqSubmissionComponent },
  {path: 'account', component: AccountComponent, children: [
    { path: 'messenger', component: MainChatComponent },
    { path: 'viewdetails', component: ViewDetailsComponent },
    { path: 'rfqdetails/:rfqId', component: RfqViewDetailsComponent },
    { path: 'buyer-dashboard', component: AccountHomeComponent },
    { path: 'profile', component: AccountProfileV2Component },
    { path: 'contact', component: CompanyInfoComponent },
    { path: 'notifications', component: NotificationListComponent },
    // { path: 'wishlist', component: WishlistComponent },
    // { path: 'product-compare', component: ProductCompareComponent },
    { path: 'assist', component: AssistChatComponent },
  ], canActivate: [AuthGuard] },
  // { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: '**', loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule) },
]



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
