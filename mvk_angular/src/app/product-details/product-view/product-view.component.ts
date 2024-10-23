import {
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "../../shared/services/crud.service";
import { NgxGalleryAnimation, NgxGalleryOptions } from "@kolkov/ngx-gallery";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ImageViewComponent } from "../image-view/image-view.component";
import { CompanyDetails } from "../models/company";
import { Package, ProductDetails, Supplier } from "../models/product";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  myThumbnail!: string;
  myFullresImage!: string;
  galleryOptions: NgxGalleryOptions[] = [
    {
      width: "100%",
      height: "auto",
      imagePercent: 100,
      thumbnailsColumns: 4,
      thumbnailMargin: 10,
      thumbnailsMargin: 10,
      thumbnailSize: "cover",
      thumbnailsAutoHide: true,
      preview: true,
      previewZoom: true,
      previewZoomMax: 3,
      previewZoomMin: 1,
      previewZoomStep: 0.1,
      previewAnimation: true,
      imageAnimation: NgxGalleryAnimation.Zoom,
    },
    // max-width 800
    {
      breakpoint: 800,
      width: "600px",
      height: "600px",
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20,
    },
    // max-width 400
    {
      breakpoint: 400,
      preview: false,
    },
  ];
  productsYouMayAlsoLike: any[] = [];
  frequentlyBought: any[] = [];
  popularProducts: any[] = [];
  sellerId: number = 0;

  sellerDetails = {
    productName: "",
    units: "",
    sellerAccountId: 0,
    sellerId: 0,
    companyName: "",
    companyLogo: "",
    category_id: 0,
    env: "",
    product_id: 0,
    buyerSellerStatus: 0,
  };
  productSchema: any;

  constructor(
    private crud: CrudService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet
  ) {}
  productId: number = 0;
  isSignIn = false;
  ngOnInit(): void {
    // this.createForm();
    if (localStorage.getItem("token")) {
      this.isSignIn = true;
    }
    this.route.params.subscribe((params) => {
      let url: string = params["id"];
      this.productId = Number(url.slice(url.lastIndexOf("-") + 1));
      this.getProductDetils();
    });
  }

  setSellerDetails(details: ProductDetails, company: CompanyDetails) {
    this.sellerDetails.sellerAccountId = details.account_id;
    this.sellerDetails.sellerId = details.seller_id;
    this.sellerDetails.companyName = company.company_name;
    this.sellerDetails.companyLogo = company.seller_company_logo;
    this.sellerDetails.category_id = details.category_id;
    this.sellerDetails.env = "product";
    this.sellerDetails.product_id = this.productId;
    this.sellerDetails.productName = details.name;
    this.sellerDetails.units = details.unit_type;
    this.sellerDetails.buyerSellerStatus = details.buyer_seller_status;
  }

  productFound: boolean = true;
  loader: boolean = true;
  productImages: string[] = [];
  productImagesCompress: string[] = [];
  productDetails!: ProductDetails | null;
  companyDetails!: CompanyDetails;
  packageDetails!: Package;
  otherSuppliers: Supplier[] = [];
  vari: Var[] = [];
  allVari: AllVariations[] = [];
  getProductDetils() {

    this.crud.getProductDetilsV2(this.productId).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status == 200) {
          this.category_name = res.data.product_details.category_name;
          this.productDetails = {
            ...res.data.product_details,
            ...res.data.key_attributes,
          } as ProductDetails;
          this.category_id = this.productDetails.category_id;
          this.companyDetails = res.data.company_details as CompanyDetails;
          this.packageDetails = res.data.packaging_and_delivery as Package;
          let images = res.data?.product_all_images;
          if (Object.keys(images).length !== 0) {
            this.productImages = images.original_images;
            this.productImagesCompress = images.compress_images;
          } else {
            this.productImages = [];
            this.productImagesCompress = [];
          }
          this.otherSuppliers = res.data.other_suppliers;
          this.otherSuppliers = this.otherSuppliers.map(sup => ({...sup, more: false}));
          this.vari = res.data.variations;
          this.allVari = res.data.all_variations_combinations;
          this.createVariationForm();
          this.subscribeToFormChanges();

          this.sellerId = this.productDetails.seller_id;
          this.myThumbnail =
            this.productDetails.image ||
            "https://api.myverkoper.com/assets/seller/images/mvk-no-image.png";
          this.myFullresImage =
            this.productDetails.image ||
            "https://api.myverkoper.com/assets/seller/images/mvk-no-image.png";
          this.productFound = true;
          this.setDetails(this.productDetails, this.companyDetails);
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

  setDetails(productDetails: ProductDetails, companyDetails: CompanyDetails) {
    this.setSellerDetails(productDetails, companyDetails);
    this.getYouMayalsoLike(productDetails.id);
    this.getFrequentlyBought(productDetails.id);
    this.getPopularProducts(productDetails.seller_id);
  }

  getPopularProducts(sellerId: number) {
    this.crud.getPopularProducts(sellerId).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.popularProducts = res.data.products;
        }
      },
      error: (error: any) => {
        console.log("Supplier popular products: " + error);
      },
    });
  }

  getFrequentlyBought(id: number) {
    this.crud.getFrequentlyBought(id).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.frequentlyBought = res.data.products;
        }
      },
      error: (error: any) => {
        console.log("frequently bought error: " + error);
      },
    });
  }

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

  changeImage(image: string) {
    this.myThumbnail = image;
    let index = this.productImages.indexOf(image);
    this.myFullresImage = this.productImages[index];
  }

  openImagePopup() {
    if(!(this.productImages.length > 0)) return;
    const imageRef = this.dialog.open(ImageViewComponent, {
      panelClass: "img_popup",
      data: {
        original: this.productImages,
        compress: this.productImages,
        productName: this.productDetails?.name,
      },
      disableClose: true,
    });
  }

  variationForm!: FormGroup;
  createVariationForm(): void {
    this.variationForm = this.fb.group({});
    this.vari.forEach((item) => {
      let selectedId = item.variation.find((v) => v.selected)?.variation_id;
      this.variationForm.addControl(item.name, new FormControl(selectedId));
    });
  }

  subscribeToFormChanges(): void {
    let initialValue = this.variationForm.value;
    this.variationForm.valueChanges.subscribe((value) => {
      let selectedIds = "";
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          selectedIds += value[key] + ",";
        }
      }
      selectedIds = selectedIds.slice(0, -1);
      let allVari = this.allVari.find(v => v.combination_id == selectedIds);
      if(allVari?.status) {  
        initialValue = value; 
        let productId = allVari.product_id;
        if(!productId) {
          console.info("product not found for variation " + selectedIds);
          return;
        }
        let productName = encodeURIComponent(this.productDetails?.name as string).toLowerCase();
        let url = productName + "-" + productId;
        this.router.navigate(['/product/view', url]);
      } else {
        this.toastr.error("Product not available");
        this.variationForm.patchValue(initialValue);
      }
    });
  }

  isImageAvailable = true;

  otherSuppliersModal = false;

  otherSuppliersModalBtn(){
    this.otherSuppliersModal = true;
  }
  closeOtherSuppliersModalBtn(){
    this.otherSuppliersModal = false;
  }

  // toggleDetails(index: number){
  //   this.otherSuppliers[index].more = !this.otherSuppliers[index].more
  // }

  isModalOpen = false;

  openModal(){
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }
  closeModal(){
    this.isModalOpen = false ;
    document.body.classList.remove('modal-open');
  }

  
  catHovered = false;
  companyHovered = false;
  
  category_name = '';
  category_id = 0;


}

interface Var {
  name: string;
  id: string;
  variation: Array<Variation>;
}

interface Variation {
  name: string;
  variation_id: number;
  selected: boolean;
}

interface AllVariations {
  combination_id: string;
  product_id: number;
  status: boolean
}
