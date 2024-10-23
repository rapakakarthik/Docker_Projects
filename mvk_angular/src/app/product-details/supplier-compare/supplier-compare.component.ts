import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CrudService } from "src/app/shared/services/crud.service";
import { CompanyDetails } from "../models/company";
import { ProductDetails, Package, Supplier } from "../models/product";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-supplier-compare",
  templateUrl: "./supplier-compare.component.html",
  styleUrl: "./supplier-compare.component.scss",
})
export class SupplierCompareComponent implements OnInit {

  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private titleService = inject(Title);
  
  productId: number = 0;
  isSignIn = false;
  ngOnInit(): void {
    if (localStorage.getItem("token")) {
      this.isSignIn = true;
    }
    this.route.params.subscribe((params) => {
      let url: string = params["id"];
      this.productId = Number(url.slice(url.lastIndexOf("-") + 1));
      this.getProductDetils();
    });
  }

  constructor(private crud: CrudService) {}




  productFound: boolean = false;
  loader: boolean = true;
  productDetails!: ProductDetails | null;
  packageDetails!: Package;
  otherSuppliers: Supplier[] = [];
  sellerId: number = 0;
  categoryHierarchy: Category[] = [];

  getProductDetils() {

    this.crud.getProductDetilsV2(this.productId).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status == 200) {
          this.categoryHierarchy = res.data.category_hierarchy;
          this.productDetails = {
            ...res.data.product_details,
            ...res.data.key_attributes,
          } as ProductDetails;
          this.otherSuppliers = res.data.other_suppliers;
          this.isFav = this.productDetails.is_saved_product === 1;
          this.sellerId = this.productDetails.seller_id;
          this.productFound = true;
          this.titleService.setTitle(this.productDetails.name + " - MyVerkoper.com");
        this.getYouMayalsoLike(this.productDetails.id);
        } else {
          this.productFound = false;
          this.productDetails = null;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        this.productFound = false;
        console.log(err.message);
      },
    });
  } 
  

  productsYouMayAlsoLike: any[] = [];

  getYouMayalsoLike(id: number) {
    this.crud.getProductsYouMayAlsoLike(id).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.productsYouMayAlsoLike = res.data.products;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log("you may also like error: " + error);
      },
    });
  }

  // add and remove from favorites
  isFav = false;
  folderId = 0;
  addToFav() {
    if (!this.isSignIn) {
      this.goToSginIn();
      return;
    }
    this.crud.addProductToWishlist(this.productId.toString(), this.folderId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.toastr.success("Product added to wishlist");
            this.isFav = true;
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error("Internal server error");
          console.error("Product addFav error msg", err.error);
        },
      });
  }

  removeFromFav() {
    this.crud.removeProductFromWishlist(this.productId.toString(), this.folderId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.toastr.success("Product removed from wishlist");
            this.isFav = false;
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error("Internal server error");
          console.error("Product removeFav error msg", err.error);
        },
      });
  }

  goToCompany(name: string, id: number) {
    let cname = encodeURIComponent(name).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate([`/company/${url}`]);
  }

  goToSginIn() {
    let history = this.location.path();
    this.router.navigateByUrl(`/signin?return_to=${history}`);
  }

  // share funcationality
  share() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this seller!',
        url: window.location.href
      }).then(() => {
        console.log('Successful share');
      }).catch(error => {
        console.error('Error sharing', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Web Share API is not supported in your browser.');
    }
  }

  category_name = '';
  category_id = 0;
  navToCat(id: number, name: string) {
    let url = '/category/' + encodeURIComponent(name).toLowerCase() + '-' + id;
    this.router.navigate([url]);
  }
}


interface Category {
  cat_id: number,
  cat_name: string
}