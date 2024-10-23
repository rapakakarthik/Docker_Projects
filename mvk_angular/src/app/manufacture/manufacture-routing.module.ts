import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturesTabComponent } from '../home/manufactures-tab/manufactures-tab.component';

const routes: Routes = [
  {
    path: '',
    component: ManufacturesTabComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufactureRoutingModule { }
