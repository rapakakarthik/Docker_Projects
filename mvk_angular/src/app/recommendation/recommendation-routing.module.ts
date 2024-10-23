import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendationComponent } from './recommendation.component';
import { RoomRecommendationComponent } from './room-recommendation/room-recommendation.component';
import { ClassRecommendationComponent } from './class-recommendation/class-recommendation.component';
import { SchoolRecommendationComponent } from './school-recommendation/school-recommendation.component';

const routes: Routes = [
  { path: 'room', component: RecommendationComponent },
  { path: 'class/:classId', component: ClassRecommendationComponent },
  { path: 'school/:schoolId/:subSchoolId', component: SchoolRecommendationComponent },
  { path: ':roomId/:subRoomId', component: RoomRecommendationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommendationRoutingModule { }
