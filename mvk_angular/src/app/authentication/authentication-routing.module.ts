import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
//  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  // { path: '', component: SigninComponent, data: { title: 'SignIn'} },
  // { path: 'signup', component: SignupComponent, data: { title: 'SignUp'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
