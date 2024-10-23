import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { WishlistData } from 'src/app/shared/models/wishlist/api-response';
import { WishlistProduct } from 'src/app/shared/models/wishlist/wishlist-product';
import { SupplierProduct, WishilistSupplier } from 'src/app/shared/models/wishlist/wishlist-supplier';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist-share-view',
  templateUrl: './wishlist-share-view.component.html',
  styleUrl: './wishlist-share-view.component.scss'
})
export class WishlistShareViewComponent implements OnInit{

  private auth = inject(AuthenticationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private wish = inject(WishlistService);
  
  constructor() {

  }
  ngOnInit(): void {
    this.getRoutes();
  }

  isLogged: boolean = false;
  isProducts = false;
  getRoutes() {
    let token = this.route.snapshot.params['token']    
    let type = this.route.snapshot.params['type']  
    this.isProducts = type == 'products';
    this.isLogged = this.auth.isLoggedIn();
    this.getWishlistSharedDataApi(token);
  }

  getSellerDetailsFromSupplier(det: WishilistSupplier) {
    let sellerDetails = {
      sellerAccountId: det.seller_account_id,
      sellerId: det.seller_id,
      companyName: det.seller_company_name,
      companyLogo: det.company_name_logo,
      env: 'company',
      product_id: '',
      buyerSellerStatus: det.buyer_seller_status
    }
    return sellerDetails;
  }

  
  viewClass: string = 'list_view'; // Default class

  listView(): void {
    this.viewClass = 'list_view';
  }

  gridView(): void {
    this.viewClass = 'grid_view';
  }

  getWishlistSharedDataApi(token: string) {
    this.isInvalidLink = false;
    this.wish.getWishlistSharedDataApiNoAuth({share_link: token}).subscribe({
      next: (value) => {
        if(value.status === 200) {
          let wishListData = value.wishlist;
          if(this.isProducts) {
            this.getWishlistShareViewProducts(wishListData.folder_id);
          }
          else {
            this.getWishlistShareViewSuppliers(wishListData.folder_id);
          }
        } else {
          this.isInvalidLink = true;
        }
      },
      error: (err) => {
        this.isInvalidLink = true;
      },
    })
  }

  isInvalidLink = false;
  products$!: Observable<WishlistData<WishlistProduct> | null>;
  error$!: Observable<string>; // Observable property for error messages
  getWishlistShareViewProducts(id: number) {
    let obj = {
      limit: 10,
      skip: 0,
      folder_id: id
    }
    this.products$ = this.wish.getProductsByWishlistIdNoAuth(obj).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(err.error, err.message);
        this.error$ = of("An error occurred while fetching users. Please try again later.")
        return of(null);
      })
    )
  }

  suppliers$!: Observable<WishlistData<WishilistSupplier> | null>;
  getWishlistShareViewSuppliers(id: number) {
    let obj = {
      limit: 10,
      skip: 0,
      folder_id: id
    }
    this.suppliers$ = this.wish.getCompanyByWishlistIdNoAuth(obj).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(err.error, err.message);
        this.error$ = of("An error occurred while fetching users. Please try again later.")
        return of(null);
      })
    )
  }

  // For contact supplier code

  getSellerDetails(product: WishlistProduct) {
    let sellerDetails = {
      productName: product.prod_name,
      sellerAccountId: product.pk_seller_account_id,
      sellerId: product.fk_seller_user_id,
      companyName: product.admin_user_company_name,
      companyLogo: product.company_name_logo,
      category_id: 10,
      env: 'product',
      product_id: product.product_id,
    }
    return sellerDetails;
  }

  // naviagate to product details
  goToProductDetails(product: WishlistProduct) {
    let name = encodeURIComponent(product.prod_name);
    let url: string = name + "-" + product.product_id;
    this.router.navigate(["/product", url])
  }
  
  // naviagate to product details
  goToProductDetails2(product: SupplierProduct) {
    let name = encodeURIComponent(product.product_name);
    let url: string = name + "-" + product.product_id;
    this.router.navigate(["/product", url])
  }

  goToCompany(cName: string, id: number) {
    let name = encodeURIComponent(cName);
    let url: string = name + "-" + id;
    this.router.navigate(["/company", url])
  }


}
