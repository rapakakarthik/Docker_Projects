import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "../shared/services/crud.service";
import { NgxGalleryAnimation, NgxGalleryOptions } from "@kolkov/ngx-gallery";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Meta, Title } from "@angular/platform-browser";
import { ImageViewComponent } from "./image-view/image-view.component";
import { CompanyDetails } from "./models/company";
import { Package, ProductDetails, ProductMedia, Supplier } from "./models/product";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export default class ProductDetailsComponent implements OnInit, OnDestroy {
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
    private titleService: Title,
    private meta: Meta,
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

  ngOnDestroy(): void {
    this.titleService.setTitle(
      "MyVerkoper: B2B Ecommerce Marketplace for Education Institutions"
    );
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
  productDetails!: ProductDetails | null;
  companyDetails!: CompanyDetails;
  packageDetails!: Package;
  otherSuppliers: Supplier[] = [];
  vari: Var[] = [];
  allVari: AllVariations[] = [];
  categoryHierarchy: Category[] = [];
  allMedia: ProductMedia[] = [];
  getProductDetils() {

    this.crud.getProductDetilsV2(this.productId).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status == 200) {
          this.categoryHierarchy = res.data.category_hierarchy;
          this.category_name = res.data.product_details.category_name;
          this.productDetails = {
            ...res.data.product_details,
            ...res.data.key_attributes,
          } as ProductDetails;
          this.allMedia = res.data.product_all_media;
          this.category_id = this.productDetails.category_id;
          this.companyDetails = res.data.company_details as CompanyDetails;
          this.packageDetails = res.data.packaging_and_delivery as Package;

          this.productImages = this.allMedia.filter(media => media.type == "image").map(media => media.value);
          this.otherSuppliers = res.data.other_suppliers;
          // this.otherSuppliers = this.otherSuppliers.map(sup => ({...sup, more: false}));
          this.vari = res.data.variations;
          this.allVari = res.data.all_variations_combinations;
          this.createVariationForm();
          this.subscribeToFormChanges();

          this.isFav = this.productDetails.is_saved_product === 1;
          this.sellerId = this.productDetails.seller_id;
          this.myFullresImage =
            this.productDetails.image ||
            "https://api.myverkoper.com/assets/seller/images/mvk-no-image.png";
          this.productFound = true;

          this.titleService.setTitle(
            this.productDetails.name + " - MyVerkoper.com"
          );
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
    this.setOpenGraphMetaTags(productDetails);
    this.generateProductSchema(productDetails);
    this.getYouMayalsoLike(productDetails.id);
    this.getFrequentlyBought(productDetails.id);
    this.getPopularProducts(productDetails.seller_id);
  }

  setOpenGraphMetaTags(productData: ProductDetails) {
    let product_name = <string>productData.name;
    product_name = encodeURIComponent(product_name).toLowerCase();
    const description = `Shop now for top-quality ${productData.name} at MyVerkoper. Explore a wide range of educational products and find everything you need for your institution`;
    // const description = this.stripHtmlTags(productData.product_description).trim().slice(0, 160);
    let url =
      "https://www.myverkoper.com/product/" +
      product_name +
      "-" +
      productData.id;

    this.meta.updateTag({ name: "og:url", property: "og:url", content: url });
    this.meta.updateTag({
      name: "og:title",
      property: "og:title",
      content: productData.meta_title || productData.name,
    });
    this.meta.updateTag({
      name: "og:description",
      property: "og:description",
      content: productData.meta_description || description,
    });
    this.meta.updateTag({
      name: "og:image",
      property: "og:image",
      itemprop: "image",
      content: productData.image,
    });
    this.meta.updateTag({
      name: "description",
      content: productData.meta_description || description,
    });
    this.meta.updateTag({
      name: "keywords",
      content: productData.meta_keywords || productData.name,
    });

    this.meta.updateTag({
      name: "twitter:title",
      content: productData.meta_title || productData.name,
    });
    this.meta.updateTag({ name: "twitter:image", content: productData.image });
    this.meta.updateTag({
      name: "twitter:description",
      content: productData.meta_description || description,
    });
  }

  private stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
    let index = this.allMedia.findIndex(media => media.value === image);
    this.myFullresImage = this.allMedia[index].value;
  }

  goToCompany(name: string, id: number) {
    let cname = encodeURIComponent(name).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate([`/company/${url}`]);
  }

  routeTo(pdetails: any): void {
    let cname: string = pdetails.seller_company.company_name;
    let id = pdetails.seller_id;
    cname = encodeURIComponent(cname).toLowerCase();
    // cname = cname.replaceAll(" ", "-").toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate(["/company", url]);
  }

  isFav: boolean = false;
  addToFav(event: Event) {
    this.isFav = !this.isFav;
    const type = this.isFav ? 1 : 0;
    this.crud.addToFavorite(this.productId, type).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.toastr.success(res.message);
          console.log(res);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message);
      },
    });
    event.stopPropagation();
  }

  // Generating schema function
  generateProductSchema(pd: ProductDetails): void {
    // console.log(this.productDetails);
    const description = this.stripHtmlTags(pd.description).trim().slice(0, 160);
    this.productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: pd.name,
      image: pd.image,
      description: description,
      brand: this.companyDetails.company_name,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: pd.total_rating,
        // "bestRating": "5",
        // "worstRating": "1",
        ratingCount: this.companyDetails.rating,
      },
      sku: "68",
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
    };
    this.appendJsonLdScript();
    // return JSON.stringify(schema);
  }

  private appendJsonLdScript(): void {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(this.productSchema);

    // Append the script to the document head
    document.head.appendChild(script);
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
        this.router.navigate(['/product', url]);
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

  
  // catHovered = false;
  // companyHovered = false;
  
  category_name = '';
  category_id = 0;
  navToCat(id: number, name: string) {
    let url = '/category/' + encodeURIComponent(name).toLowerCase() + '-' + id;
    this.router.navigate([url]);
  }

  navToCompany() {
    let cname: string = this.companyDetails.company_name;
    let id = this.productDetails?.seller_id;
    cname = encodeURIComponent(cname).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate(["/company", url]);
  }

  compareSuppliers() {
    this.router.navigate(['product/suppliers', this.productDetails?.id]);
  }

  relatedSuppliers(){
    this.router.navigate(['product/related-suppliers', this.productDetails?.id]);
  }

  showMore: boolean = false;  // Flag to control the view state (initially shows 4 items)

  toggleViewMore() {
    if(this.showMore) {
      window.scroll(0,0);
    }
    this.showMore = !this.showMore;  // Toggles between showing more and fewer items
  }

  // related suppliers new code 
  getSellerDetails(supplier: Supplier) {
    return {
      productName: supplier.product_name,
      sellerAccountId: supplier.company_id,
      sellerId: supplier.seller_id,
      companyName: supplier.company_name,
      companyLogo: supplier.image,
      category_id: 0,
      env: 'product',
      product_id: supplier.product_id,
      buyerSellerStatus: supplier.buyer_seller_status
    }
  }

  goToProduct(name: string, id: number) {
    let cname = encodeURIComponent(name).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate([`/product/${url}`]);
  }

  getInquiryDetails() {
    return {
      productName: this.productDetails?.name,
      sellerAccountId: this.productDetails?.account_id,
      sellerId: this.productDetails?.seller_id,
      companyName: this.companyDetails.company_name,
      companyLogo: this.companyDetails.seller_company_logo,
      category_id: this.category_id,
      env: 'product',
      product_id: this.productDetails?.id,
      buyerSellerStatus: this.productDetails?.buyer_seller_status
    }
  }

  // share funcationality
  share() {
    if(!this.productDetails) {
      return;
    }
    let product_name = encodeURIComponent(this.productDetails.name).toLowerCase();
    let urlG = window.location.origin + '/product/' + product_name + "-" + this.productDetails.id;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this Product!',
        url: urlG
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

interface Category {
  cat_id: number,
  cat_name: string
}