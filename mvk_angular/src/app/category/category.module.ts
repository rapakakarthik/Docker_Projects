import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category/category.component';
import { AllCategoryComponent } from './all-category/all-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { LayoutModule } from '../layout/layout.module';
import { HomeModule } from '../home/home.module';
import { CategorynewComponent } from './categorynew/categorynew.component';
import { TopRankingManufactureComponent } from './top-ranking-manufacture/top-ranking-manufacture.component';
import { TopRankingProductsComponent } from './top-ranking-products/top-ranking-products.component';
import { RecommendationResultsComponent } from './recommendation-results/recommendation-results.component';


@NgModule({
    declarations: [
        CategoryComponent,
        AllCategoryComponent,
        SubCategoryComponent,
        CategorynewComponent,
        TopRankingManufactureComponent,
        TopRankingProductsComponent,
        RecommendationResultsComponent,
    ],
    imports: [
        CommonModule,
        CategoryRoutingModule,
        LayoutModule,
        HomeModule
    ]
})
export class CategoryModule { }
