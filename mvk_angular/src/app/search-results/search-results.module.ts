import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultsRoutingModule } from './search-results-routing.module';
import { SearchResultsComponent } from './search-results.component';
import { FilterModule } from '../filter/filter.module';
import { MaterialModule } from '../shared/material/material.module';
import { LayoutModule } from '../layout/layout.module';
import { HomeModule } from '../home/home.module';


@NgModule({
  declarations: [
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    SearchResultsRoutingModule,
    FilterModule,
    MaterialModule,
    LayoutModule,
    HomeModule
  ]
})
export class SearchResultsModule { }
