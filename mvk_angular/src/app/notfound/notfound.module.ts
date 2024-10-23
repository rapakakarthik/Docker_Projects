import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotFoundRoutingModule } from './notfound-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { MaterialModule } from '../shared/material/material.module';



@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    NotFoundRoutingModule,
    LayoutModule,
    MaterialModule,
    CommonModule
  ]
})
export class NotfoundModule { }
