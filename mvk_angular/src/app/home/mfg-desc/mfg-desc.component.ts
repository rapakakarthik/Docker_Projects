import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-mfg-desc',
  templateUrl: './mfg-desc.component.html',
  styleUrls: ['./mfg-desc.component.scss']
})
export class MfgDescComponent implements OnInit {
  
  private wish = inject(WishlistService);
  private toastr = inject(ToastrService);
  private auth = inject(AuthenticationService);
  
  @Input() data!: any;
  @Input() type!: any;
  @Input() linkTo!: string;
  constructor(private router: Router) { }

  ngOnInit() {
    if(this.auth.getToken()) {
      this.isSignedIn = true;
    }
    this.folderId = this.data.folder_id || 0;
    this.isFav = this.data.is_wishlist || false;
  }

  goTo(route: string, data: any) {
    // console.log(data);
    let company_name = encodeURIComponent(data.company_name).toLowerCase();
    // let company_name = name.replaceAll(" ", "-").toLowerCase();
    let url = company_name + "-" + (data.company_id || data.seller_id);
    this.router.navigate(['/company', url]);

    // this.router.navigate([`/${route}/${id}`])
  }

  // add and remove from favorites

  //company
  isSignedIn = false;
  isFav = true;
  folderId = 0;
  addCompanyToFav() {
    // if(!this.isSignedIn) {
    //   this.goToSginIn();
    //   return;
    // }
    let obj: WishilistAddRemove = {
      record_id: this.data.seller_id,
      folder_id: this.folderId,
      type: "seller",
      action: "add"
    }
    this.wish.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("company added to wishlist");
          this.isFav = true;
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("company addFav error msg", err.error)
      }
    })
  }

  removeCompanyFromFav() {
    let obj: WishilistAddRemove = {
      record_id: this.data.seller_id,
      folder_id: this.folderId,
      type: "seller",
      action: "remove"
    }
    this.wish.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("company removed from wishlist");
          this.isFav = false;
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("company removeFav error msg", err.error)
      }
    })
  }

}
