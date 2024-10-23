import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService, ImageModel } from '../../services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})



export class ProductCardComponent implements OnInit, OnChanges {
  productSchema:any;
  @Input() description!: boolean;
  @Input() price!: boolean;
  @Input() qty!: boolean;
  @Input() orderStatus!: boolean;
  @Input() companyDetails!: boolean;
  @Input() cName!: boolean;
  @Input() discountPrice!: boolean;
  @Input() actions!: boolean;
  @Input() styleClass!: any;
  @Input() sellerDet!: any
  @Input() showFav: boolean = false;
  @Input() showAdd: boolean = false;

  sellerDetails = {
    productName: '',
    sellerAccountId: 0,
    sellerId: 0,
    companyName: "",
    companyLogo: "",
    category_id: "",
    env: '',
    product_id: '',
    buyerSellerStatus: 0
  }


  ngOnChanges(): void {
    this.itemStyle = (this.itemType == 'list') ? 'list' : ''
  }
  @Input() itemType!: any;
  @Input() type!: any;
  @Input() item!: any;
  @Input() linkTo!: string;
  isItem: boolean = false;
  itemStyle: any;
  isSignIn = false;

  constructor(
    private _router: Router, 
    private crud: CrudService, 
    private toastr: ToastrService,
    private auth: AuthenticationService,
    public dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    if(localStorage.getItem('token')) {
      this.isSignIn = true;
    }
    this.isFav = this.item?.is_saved_product === 1;
    if (this.item != undefined) {
      this.setSellerDetails()
    }
    this.isItem = this.item ? true : false
    if (this.itemType == 'list') {
      this.itemStyle = 'list'
    }
    if(this.showAdd){
      this.checkSelected();
    }
    // this.generateProductSchema();
  }

  getClass(itemStyle: any): string {
    switch (itemStyle) {
      case 'manufcard':
        return 'manucard';
      case 'bigcard':
        return 'main-product-card';
      default:
        return ''
    }
  }

  // Navigating to product detais page
  userObj: any;
  
  goTo(item: any): void {
    // console.log(item);
    if (localStorage.getItem('userObj') || true) {
      // this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      let id: number = 0
      if (item) {
        id = item.product_id || item.pk_prod_id;
        let product_name = <string>(item.product_name ?? item.prod_name);
        product_name = encodeURIComponent(product_name).toLowerCase();
        // product_name = product_name.replaceAll(" ", "-");
        let url = product_name + "-" + id
        // console.log(url);
        this._router.navigate(['/product', url]);
      }
    } else {
      this.openDialog();
    }
  }

  // Setting seller Details
  setSellerDetails() {
    if (this.item.seller_id) {
      this.sellerDetails.sellerAccountId = this.item.seller_account_id;
      this.sellerDetails.sellerId = this.item.seller_id;
      this.sellerDetails.companyName = this.item.company_name;
      this.sellerDetails.companyLogo = this.item.seller_account_logo;
      this.sellerDetails.category_id = this.item.category_id;
      this.sellerDetails.env = 'product';
      this.sellerDetails.product_id = this.item.product_id;
      this.sellerDetails.buyerSellerStatus = this.item.buyer_seller_status;
      this.sellerDetails.productName = this.item.product_name;
    }
    if (this.item.company_details) {
      this.sellerDetails.sellerAccountId = this.item.company_details.pk_seller_account_id;
      this.sellerDetails.sellerId = this.item.company_details.seller_id;
      this.sellerDetails.companyName = this.item.company_details.company_name;
      this.sellerDetails.companyLogo = this.item.company_details.company_logo;
      this.sellerDetails.category_id = this.item.company_products[0].category_id;
      this.sellerDetails.env = 'product';
      this.sellerDetails.product_id = ''
      this.sellerDetails.buyerSellerStatus = this.item.company_details.buyer_seller_status;
    }

  }

  // Add to favorite function
  isFav: boolean = false;
  addToFav(event: Event) {
    const isAuthenticated = this.auth.isLoggedIn();
    if (!isAuthenticated) {
      this.openDialog();
    } else {
      this.isFav = !this.isFav;
      const type = this.isFav ? 1 : 0;
      this.crud.addToFavorite(this.item.product_id, type).subscribe({
        next: (res) => {
          if(res.status === 200) {
            this.toastr.success(res.message)
          }else {
            this.toastr.warning(res.message)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error.message)
        }
      })
    }
    event.stopPropagation();
  }

  // Signin popup
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }

  // Generating schema function
  generateProductSchema(): void {

    this.productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": this.item.product_name,
      "image": this.item.product_image,
      "description": this.item.product_description,
      "brand": "Padma Publications",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": this.item.product_rating,
        // "bestRating": "5",
        // "worstRating": "1",
        "ratingCount": this.item.product_reviews
      },
      "sku": "68",
      // "reviews": [
      //   {
      //     "@type": "Review",
      //     "reviewBody": "",
      //     "author": {
      //       "@type": "Person",
      //       "name": "Mani"
      //     },
      //     "datePublished": "2023-05-31",
      //     "reviewRating": {
      //       "@type": "Rating",
      //       "ratingValue": "4"
      //     },
      //     "publisher": {
      //       "@type": "Organization",
      //       "name": "Good product"
      //     }
      //   }
      // ]

    }
this.appendJsonLdScript();
   // return JSON.stringify(schema);
  }
    

  private appendJsonLdScript(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(this.productSchema);

    // Append the script to the document head
    document.head.appendChild(script);
  }

  handleImageError() {
    this.item.product_image = "https://api.myverkoper.com/assets/seller/images/mvk-no-image.png";
  }

  isSelected = false;
  selectedImages: ImageModel[] = []
  addImage(event: Event) {
    let image: ImageModel = {
      url: this.item.product_image || this.item.prod_img,
      id: this.productId
    }
    this.crud.addImage(image)
    event.stopPropagation();
  }

  productId = 0;
  checkSelected() {
    this.selectedImages = this.crud.getImages();
    this.productId = this.item.prod_id || this.item.product_id;
    let index = this.selectedImages.findIndex(image => image.id == this.productId);
    this.isSelected = index>=0;
    this.crud.subject$.subscribe(images => {
      this.selectedImages = images;
      let index = this.selectedImages.findIndex(image => image.id == this.productId);
      this.isSelected = index>=0;
    })
  }
  
}