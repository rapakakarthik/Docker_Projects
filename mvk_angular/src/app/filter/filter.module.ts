import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterRoutingModule } from './filter-routing.module';
import { FilterComponent } from './filter/filter.component';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { FilterV2Component } from './filter-v2/filter-v2.component';


@NgModule({
  declarations: [
    FilterComponent,
    FilterV2Component
  ],
  imports: [
    CommonModule,
    FilterRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    FilterComponent,
    FilterV2Component
  ]
})
export class FilterModule { }
