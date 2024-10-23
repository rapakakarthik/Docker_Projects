import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SigninComponent } from 'src/app/authentication/signin/signin.component';
import { AuthenticationService } from './authentication.service';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  private router = inject(Router);
  constructor(public dialog: MatDialog, private authService: AuthenticationService, private location: Location,) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.authService.isLoggedIn()
    if (!isAuthenticated) {
      // this.openDialog();
      let history = this.location.path();
      this.router.navigateByUrl(`/signin?return_to=${history}`);
      return false
    }
    return true
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}
