import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company/company.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyPageProfileComponent } from './company-page-profile/company-page-profile.component';
import { HomeModule } from "../home/home.module";
import { CompanyContactComponent } from './company-contact/company-contact.component';
import { CompanyVideoComponent } from './company-video/company-video.component';


@NgModule({
  declarations: [
    CompanyComponent,
    CompanyPageProfileComponent,
    CompanyContactComponent,
    CompanyVideoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule,
    HomeModule
  ]
})
export class CompanyModule { }
