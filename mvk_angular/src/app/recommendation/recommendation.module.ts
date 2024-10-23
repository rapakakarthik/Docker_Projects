import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationRoutingModule } from './recommendation-routing.module';
import { RecommendationComponent } from './recommendation.component';
import { LayoutModule } from '../layout/layout.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RoomRecommendationComponent } from './room-recommendation/room-recommendation.component';
import { ClassRecommendationComponent } from './class-recommendation/class-recommendation.component';
import { SchoolRecommendationComponent } from './school-recommendation/school-recommendation.component';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { ManufactureRecommendationComponent } from './manufacture-recommendation/manufacture-recommendation.component';
import { HomeModule } from '../home/home.module';


@NgModule({
  declarations: [
    RecommendationComponent,
    RoomRecommendationComponent,
    ClassRecommendationComponent,
    SchoolRecommendationComponent,
    ProductRecommendationComponent,
    ManufactureRecommendationComponent
  ],
  imports: [
    CommonModule,
    RecommendationRoutingModule,
    LayoutModule,
    AuthenticationModule,
    HomeModule
  ]
})
export class RecommendationModule { }
