import { Component, inject, OnInit } from '@angular/core';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist-share-invite',
  templateUrl: './wishlist-share-invite.component.html',
  styleUrl: './wishlist-share-invite.component.scss'
})
export class WishlistShareInviteComponent implements OnInit{

  private auth = inject(AuthenticationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private wish = inject(WishlistService);
  private toastr = inject(ToastrService);

  constructor(public dialog: MatDialog, private location: Location) {

  }
  ngOnInit(): void {
    this.getRoutes();
  }

  getRoutes() {
    let token = this.route.snapshot.params['token'];
    this.getUserDetails();
    this.getWishlistSharedData(token);
  }

  // getRoutes() {
  //   let route = "";
  //   let token = "";
  //   this.route.queryParams.subscribe(param => {
  //     route = param['type'];
  //     token = param['token'];
  //   })
    
  //   let isLogged = this.auth.isLoggedIn();
  //   if(route === "edit") {  
  //     if(!isLogged) {
  //       this.openDialog();
  //     }
  //   }
  //   else if(route === "view") {
  //     if(!isLogged) {
  //       this.router.navigate(['/wishlist-view', token])
  //     }
  //   } else {
  //     this.router.navigateByUrl("/");
  //   }
  //   this.getUserDetails();
  //   this.getWishlistSharedData(token);
  // }

  isInvalidLink = false;
  wishListData: any;
  loader = true;
  getWishlistSharedData(token: string) {
    this.token = token;
    this.wish.getWishlistSharedDataApi({share_link: token}).subscribe({
      next: (value) => {
        this.loader = false;
        if(value.status == 200) {
          this.wishListData = value.wishlist;
          if(value.wishlist.is_accepted) {
            this.router.navigate(['/wishlist']);
          }
        } else {
          this.isInvalidLink = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        this.isInvalidLink = true;
        // error handling
      },
    })
  }

  private token: string = "";
  acceptWishlistShareRequest() {
    this.wish.acceptWishlistShareRequestApi({share_link: this.token}).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.router.navigate(['/wishlist']);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        // error handling
      },
    })
  }

  cancelInvite() {
    this.router.navigateByUrl("/");
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(PopupsigninformComponent, {
  //     width: '450px',
  //     data: this.location.path(),
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');

  //   });
  // }

  userObj: any
  getUserDetails() {
    this.userObj = this.auth.getUserDetails();
  }

}
