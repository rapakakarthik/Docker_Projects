import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout/layout.module';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { PrivacyContentComponent } from './privacy-content/privacy-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { MaterialModule } from '../shared/material/material.module';

import { MatIconModule } from '@angular/material/icon';
import { TermsComponent } from './terms/terms.component';
import { TermsContentComponent } from './terms-content/terms-content.component';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { CareersComponent } from './careers/careers.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { RouterModule } from '@angular/router';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { StoriesComponent } from './stories/stories.component';
import { StoriesDetailsComponent } from './stories-details/stories-details.component';
import { HomeModule } from '../home/home.module';
import { CancellationComponent } from './cancellation/cancellation.component';
import { ShippingComponent } from './shipping/shipping.component';

@NgModule({
  declarations: [
    PrivacyPageComponent,
    PrivacyContentComponent,
    PrivacyComponent,
    TermsComponent,
    TermsContentComponent,
    TermsPageComponent,
    WelcomepageComponent,
    CareersComponent,
    HelpComponent, 
    AboutComponent, 
    ContactComponent, FaqComponent, BlogComponent, BlogDetailsComponent, StoriesComponent, StoriesDetailsComponent, 
    CancellationComponent, ShippingComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule, 
    LayoutModule, 
    MaterialModule, 
    RouterModule,
    HomeModule,
    ShareButtonsModule.withConfig({debug: true}),
    ShareIconsModule
  ],
  exports: [
    PrivacyPageComponent,
    PrivacyContentComponent,
    PrivacyComponent,
    TermsComponent,
  ],
})
export class CustompagesModule {}
