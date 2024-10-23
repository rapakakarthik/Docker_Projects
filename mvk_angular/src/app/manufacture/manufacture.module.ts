import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufactureRoutingModule } from './manufacture-routing.module';
import { HomeModule } from '../home/home.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManufactureRoutingModule,
    HomeModule
  ]
})
export class ManufactureModule { }
