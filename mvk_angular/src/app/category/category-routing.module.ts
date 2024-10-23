import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCategoryComponent } from './all-category/all-category.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CategorynewComponent } from './categorynew/categorynew.component';
import { TopRankingManufactureComponent } from './top-ranking-manufacture/top-ranking-manufacture.component';
import { RecommendationResultsComponent } from './recommendation-results/recommendation-results.component';

const routes: Routes = [
   {path:'topranking/:type/:catId', component: CategorynewComponent},
  // {path:'topsearch/:id', component: CategorynewComponent},
  // {path:'mostpopular/:id', component: CategorynewComponent},
  // {path:'newlyadded/:id', component: CategorynewComponent},
  {path:'topMan/:type/:catId', component: TopRankingManufactureComponent},
  {path:':type/:catId', component: RecommendationResultsComponent},
  {path: '', component: CategoryComponent, children: [
    {path:'all', component: AllCategoryComponent},
    {path:':id', component: SubCategoryComponent},
  ]},
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class CategoryRoutingModule { }
