import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MutipleObj, SelectedProduct } from 'src/app/account/wishlist/wishlist.component';
import { EnquiryMultipleComponent } from 'src/app/shared/components/enquiry-multiple/enquiry-multiple.component';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  private toastr = inject(ToastrService);
  private auth = inject(AuthenticationService);
  private location = inject(Location);
  private wish = inject(WishlistService);
  
  
  companyId: number = 0
  companyProfileDetails: any;
  products: any[] = [];
  categoryId: number = 0;
  sellerDetails = {
    sellerAccountId: 0,
    sellerId: 0,
    companyName: "",
    companyLogo: "",
    env: "",
    product_id:'',
    buyerSellerStatus: 0
  }

  isSignedIn = false;

  constructor(private route: ActivatedRoute, 
    private crud: CrudService, 
    private rfqService: RfqService,
    private router: Router, private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    if(this.auth.getToken()) {
      this.isSignedIn = true;
    }
    this.route.params.subscribe(params => {

      let url: string = params['id'];
      this.companyId = Number(url.slice(url.lastIndexOf("-") + 1));
      // console.log(url,this.companyId);
    })
    this.getCompanyDetails(this.companyId, 0);
  }


  loader: boolean = true;
  // companyDetails!: any;
  dataFound: boolean = true;
  text: string = "Company Details Not Found";
  totalCount = 40;
  searchText = '';
  companyProfile: any;
  basicDetails: any;
  getCompanyDetails(id: number, skip: number) {
    // this.products = [];
    this.dataFound = true;
    this.crud.getSellerDetails(id, this.searchText, this.selectedChip, 0, skip).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.isFav = res.data.basic_details.is_favourite;
          this.folderId = res.data.basic_details.folder_id;
          this.getCompanyCategoryProducts(id, skip)
          this.companyProfile = res.data.company_profile;
          this.basicDetails = res.data.basic_details;
          this.companyProfileDetails = res.data
          this.setSellerDetails(this.companyProfile, this.basicDetails)
        }
        else {
          this.loader = false;
          this.dataFound = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.dataFound = false;
        console.error("company error msg", err.error)
      }
    })
  }

  getProducts() {
    this.loader = true;
    this.products = [];
    // this.getCompanyDetails(this.companyId, 0);
    this.crud.getCompanyCategoryProducts(this.companyId, this.searchText, this.selectedChip, 0).subscribe(res => {
      if (res.status === 200) {
        this.loader = false;
        this.products = this.alterProducts(res.data.products);
        this.totalCount = res.data.count;
      } else {
        this.loader = false;
      }
    })
  }


  showChat = false;
  setSellerDetails(profile: any, details: any) {
    this.sellerDetails.sellerAccountId = profile.seller_company_id ?? 0;
    this.sellerDetails.sellerId = details.seller_user_id ?? 0;
    this.sellerDetails.companyName = profile.seller_company_name ?? "";
    this.sellerDetails.companyLogo = profile.seller_company_logo ?? "";
    this.sellerDetails.env = 'company';
    this.sellerDetails.product_id = '';
    this.sellerDetails.buyerSellerStatus = details.buyer_seller_status ?? 0;
    this.showChat = details.buyer_seller_status == 1;
    this.connectionEstablished = details.buyer_seller_status == 1;
  }


  categoryName = '';
  changeProducts(id: number, name: string) {
    this.categoryId = id;
    this.categoryName = name;
    this.p = 1;
    this.searchText = "";
    this.loader = true;
    this.products = [];
    this.crud.getCompanyCategoryProducts(this.companyId, this.searchText, this.selectedChip, id).subscribe(res => {
      if (res.status === 200) {
        this.loader = false;
        this.products = this.alterProducts(res.data.products);
        this.totalCount = res.data.count;
      } else {
        this.loader = false;
      }
    })
  }

  goTo(product: any) {
    console.log(product);
    let product_name = product.product_name;
    let product_id = product.product_id;
    let url = product_name + "-" + product_id;
    this.router.navigate(['/product', url])
  }

  skipItems: number = 0;
  p: number = 0;
  onPageChange(pageNumber: number) {
    this.p = pageNumber
    this.skipItems = (pageNumber - 1) * 18;
    this.getCompanyDetails(this.companyId, this.skipItems);
    window.scrollTo(0, 0);
  }

  changeChip(chip: {key: string, val: string}) {
    this.selectedChip = chip.key;
    this.searchText = "";
    this.loader = true;
    this.products = [];
    this.crud.getCompanyCategoryProducts(this.companyId, this.searchText, this.selectedChip, 0).subscribe(res => {
      if (res.status === 200) {
        this.loader = false;
        this.products = this.alterProducts(res.data.products);
        this.totalCount = res.data.count;
      } else {
        this.loader = false;
      }
    })
  } 

  sendInquiry() {
    this.multipleEnquiry();
  }


  // new funcationality 

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

  // add and remove from favorites

  //company
  isFav = false;
  folderId = 0;
  addCompanyToFav() {
    if(!this.isSignedIn) {
      this.goToSginIn();
      return;
    }
    let obj: WishilistAddRemove = {
      record_id: this.sellerDetails.sellerId,
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
      record_id: this.sellerDetails.sellerId,
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

  //product 

  isFavProduct = false;
  addProductToFav(id: number) {
    if(!this.isSignedIn) {
      this.goToSginIn();
      return;
    }
    let index = this.products.findIndex(product => product.product_id === id);
    this.products[index].is_wishlist = true;
    let obj: WishilistAddRemove = {
      record_id: id,
      folder_id: 0,
      type: "product",
      action: "add"
    }
    this.wish.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Product added to wishlist");
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

  removeProductFromFav(id: number) {
    let index = this.products.findIndex(product => product.product_id === id);
    this.products[index].is_wishlist = false;
    let obj: WishilistAddRemove = {
      record_id: id,
      folder_id: this.folderId,
      type: "product",
      action: "remove"
    }
    this.wish.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Product removed from wishlist");
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




  goToSginIn() {
    let history = this.location.path();
    this.router.navigateByUrl(`/signin?return_to=${history}`);
  }
  selectedTabIndex = 0;

  // new product card 

  viewClass: string = 'v3_grid_view'; // Default class

  listView(): void {
    this.viewClass = 'v3_list_view';
  }

  gridView(): void {
    this.viewClass = 'v3_grid_view';
  }

  isSelected = false;
  addImage(product: any) {
    if(this.selectedProducts.length >= 20) {
      alert("Maximum limit reached");
      return;
    }
    let index = this.products.findIndex(prod => prod.product_id === product.product_id);
    this.products[index].selected = true;
    this.selectedProducts.push(new selectedProduct(product.product_id, product.product_image, product.product_name));
  }

  selectedProducts: selectedProduct[] = [];
  unSelect(id: number) {
    let index = this.products.findIndex(prod => prod.product_id === id);
    this.products[index].selected = false;
    this.selectedProducts = this.selectedProducts.filter(prod => prod.id !== id);
  } 

  // Contact supplier code
  @ViewChild('contactSupplierTemplate') contactSupplierTemplate!: TemplateRef<any>;
  contactSupplierTemplateRef!: MatDialogRef<any, any>;
  contactSupplierPopup() {
    this.setForm();
    this.contactSupplierTemplateRef = this.dialog.open(this.contactSupplierTemplate, {
      width: '650px',
      // disableClose: true,
    });

    this.contactSupplierTemplateRef.afterClosed().subscribe((res: any) => {
      this.contactSupplierTemplateRef.close();
    });
  }
  
  closeDialog() {
    this.contactSupplierTemplateRef.close();
  }

  textError = false;
  contactSupplier() {

  }

  setForm() {
    this.contactSupplierForm = this.fb.group({
      product_name: ['', Validators.required],
      description: ['', Validators.required],
      // business_card: ['']
    });
  }

  //Form Submit
  contactSupplierForm!: FormGroup;
  submit(formData: any) {
    let fd = formData.value;
    const sd = this.sellerDetails;
    let submitData: any = {
      company_id: sd.sellerAccountId,
      seller_id: sd.sellerId,
      enquery_type: 'company',
      device_type: 0,
      product_name: fd.product_name,
      description: fd.description,
    };
    // console.log(submitData)
    this.contactSupplierSubmit(submitData);
  }
  
  contactSupplierSubmit(submitData: any) {
    this.rfqService.contactSupplierApi(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.contactSupplierTemplateRef.close();
        } else {
          this.toastr.error(res.message);
          console.warn(res.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message)
        console.error("contact supplier form submit: " + error.message)
      }
    });
  }


  // Post Inquiry code
  getSellerDetails(product: any) {
    let sellerDetails = {
      productName: product.product_name as string,
      sellerAccountId: this.sellerDetails.sellerAccountId,
      sellerId: this.sellerDetails.sellerId,
      companyName: this.sellerDetails.companyName,
      companyLogo: this.sellerDetails.companyLogo,
      env: 'product',
      product_id: product.product_id as number,
    }
    return sellerDetails;
  }

  goToProduct(name: string, id: number): void {
    let product_name = encodeURIComponent(name).toLowerCase();
    let url = product_name + "-" + id
    this.router.navigate(['/product', url]);
  }

  connectionEstablished = false;

  // send multiple Inquiry 
  multipleEnquiry() {
    let multipleObj: MutipleObj = {
      type: "product",
      products: this.selectedProducts,
      suppliers: []
    }
    const dialogRef = this.dialog.open(EnquiryMultipleComponent, {
      width: '700px',
      data: multipleObj
    });

    dialogRef.afterClosed().subscribe((_result: any) => {
      this.resetSelected();
      console.log('The dialog was closed');
    });
  }
  
  resetSelected() {
    this.selectedProducts = [];
    this.products = this.products.map(product => ({...product, selected: false}));
  }

  alterProducts(products: any[]) {
    let alteredProducts: any[] = products.map(product => {
      let isSelected = false;
      this.selectedProducts.forEach(prod => {
        if(prod.id === product.pk_prod_id) {
          isSelected = true;
          return;
        }
      });
      return {
        product_id: product.pk_prod_id,
        product_name: product.prod_name,
        product_image: product.prod_img,
        quantity: product.min_quantity,
        unit_type: product.unit_type,
        price: product.prod_pricing,
        is_wishlist: product.is_saved_product == 1,
        folder_id: 0,
        selected: isSelected
      }
    })
    return alteredProducts;
  }

  // new category code 
  categories: any[] = [];
  chips: {key: string, val: string}[] = []
  selectedChip = '';
  getCompanyCategoryProducts(id: number, skip: number) {
    this.products = [];
    this.dataFound = true;
    this.crud.getCompanyCategoryProducts(id, this.searchText, this.selectedChip, 0, skip).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = this.alterProducts(res.data.products);
          this.categories = res.company_category_list;
          this.chips = res.filters;
          this.selectedChip = this.chips[0].key;
          this.loader = false;
          this.totalCount = res.data.count;
        }
        else {
          this.loader = false;
          this.dataFound = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.dataFound = false;
        console.error("company error msg", err.error)
      }
    })
  }
}

export class selectedProduct implements SelectedProduct{
  constructor(public id: number, public image: string, public name: string) {}
}