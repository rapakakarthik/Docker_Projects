import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { layout, LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthenticationModule } from '../authentication/authentication.module';
import { MenuV2Component } from './menu-v2/menu-v2.component';
import { NotificationComponent } from './notification/notification.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    layout,
    MenuV2Component,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    MatFormFieldModule,
    AuthenticationModule,
    NgxPaginationModule
  ],
  exports: [layout, SharedModule],

  providers: []
})
export class LayoutModule { }


