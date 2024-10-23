import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WishlistData, WishlistResponse } from 'src/app/shared/models/wishlist/api-response';
import { WishListFolder } from 'src/app/shared/models/wishlist/wishlist-folder';
import { CompareProduct, WishlistProduct } from 'src/app/shared/models/wishlist/wishlist-product';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { MutipleObj, Product, SelectedProduct, SelectedSupplier, Seller } from '../wishlist.component';
import { EnquiryMultipleComponent } from 'src/app/shared/components/enquiry-multiple/enquiry-multiple.component';

@Component({
  selector: 'app-product-compare',
  templateUrl: './product-compare.component.html',
  styleUrl: './product-compare.component.scss'
})
export class ProductCompareComponent implements OnInit{

  private wserivce = inject(WishlistService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @Input({required: true}) selectedId: string = '';
  @Input({required: true}) activeId: number = 0;
  @Input({required: true}) wishListFolders: WishListFolder[] = [];
  @Output() hide = new EventEmitter();
  

  constructor(private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.getProductsCompare(this.selectedId);
    this.setupSelectAllControl();
    this.setupSelectArrayControls();
  }


  products: WishlistProduct[] = [];
  limit: number = 8;
  skip: number = 0;

  productsLoader!: boolean;
  productDataFound!: boolean;
  // products!: CompareProduct[];
  getProductsCompare(ids: string) {
    this.wserivce.getProductsCompare(ids).subscribe({
      next: (value: WishlistData<WishlistProduct>) => {
        this.productsLoader = false;
        if(value.status == 200) {
          this.productDataFound = true;
          this.addFormControls(value.data);
          this.selectAll.setValue(true);
          this.products = value.data.slice(0,3);
          // this.dynamicFields.reset();
          // this.selectAll.reset();
        } else {
          this.productDataFound = false;
          // this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.productsLoader = false;
        this.productDataFound = false;
      },
    })
  }

  // Reactive forms 
  selectedIds: number[] = [];
  
  selectForm = this.fb.group({
    selectAll: [true],
    select: this.fb.array([])
  });

  get dynamicFields() {
    return this.selectForm.get('select') as FormArray;
  }
  get selectAll() {
    return this.selectForm.get('selectAll') as FormControl;
  }

  addFormControls(products: WishlistProduct[]): void {
    products.forEach((product) => {
      // this.selectProduct(product.product_id, product.prod_img);
      this.dynamicFields.push(this.fb.control(true));
    });
  }

  setupSelectAllControl(): void {
    this.selectAll.valueChanges.subscribe(value => {
      this.oneSelected = value;
      // this.moveTo.emit(value);
      this.dynamicFields.controls.forEach(control => {
        control.setValue(value, { emitEvent: false });
      });
    });
    this.moveToGroup.valueChanges.subscribe(id => {
      if(id && id !== "0") {
        this.moveToGroup.setValue("0");
        this.moveProductsToWishlist(parseInt(id));
      }
    }); 
  }

  // Set up listeners for the FormArray controls
  oneSelected = false;
  setupSelectArrayControls(): void {
    this.dynamicFields.valueChanges.subscribe((values: boolean[]) => {
      const allSelected = values.every(control => control);
      this.selectAll.setValue(allSelected, { emitEvent: false });
      this.oneSelected = values.some(control => control);
      // this.moveTo.emit(this.oneSelected);
    });
  }


  getSelectedIds(): string {
    let selectedValues: boolean[] = this.dynamicFields.value;
    selectedValues.forEach((v: boolean, i: number) => {
      let productId = this.products[i].product_id;
      if(v) {
        if(!this.selectedIds.includes(productId)) {
          this.selectedIds.push(productId);
        }
      } else {
        if(this.selectedIds.includes(productId)) {
          let index = this.selectedIds.findIndex(id => id == productId);
          this.selectedIds.splice(index, 1);
        }
      }
    })
    let selectedIdsStr = this.selectedIds.join(',');
    return selectedIdsStr;
  }


  // selected products 
  // selectedProducts: {image: string, id: number}[] = [
  //   {image: "/assets/images/dummy_product.jpg", id: 1},
  //   {image: "/assets/images/dummy_product.jpg", id: 2}
  // ];
  unselectProduct(index: number) {
    this.dynamicFields.removeAt(index);
    this.products.splice(index, 1);
    // this.dynamicFields.controls[index].setValue(false);
  }

  // selectProduct(id: number, image: string) {
  //   this.selectedProducts.push({image, id});
  // }


  // Top wishlist code 

  listName = new FormControl('', Validators.required);
  moveToGroup = new FormControl('default');
  moveTo = new FormControl('default');
  
  moveProductsToWishlist(folderId: number) {
    let selectedIds = this.getSelectedIds();
    this.moveProductsToWishlistAPI(selectedIds, folderId);
  }


  moveProductsToWishlistAPI(productId: string, folderId: number) {
    this.wserivce.moveProductsToWishlist(productId, this.activeId, folderId, 0).subscribe({
      next: (res: any) => {
        this.hide.emit();
        if (res.status === 200) {
          this.toastr.success("Products moved to wishlist");
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("Products multi addFav error msg", err.error)
      }
    })
  }
  
  deleteProductsFromWishlist() {
    let selectedIds = this.getSelectedIds();
    console.log(selectedIds);
    this.deleteProductFromWishListAPI(selectedIds, this.activeId);
  }

  deleteProductFromWishListAPI(productId: string, folderId: number) {
    let obj: WishilistAddRemove = {
      record_id: productId,
      folder_id: this.activeId,
      type: "product",
      action: "remove"
    }
    this.wserivce.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        this.hide.emit();
        if (res.status === 200) {
          this.toastr.success("Products removed from wishlist");
        }else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("Products remove multi error msg", err.error)
      }
    })
  }

  getSellerDetails(det: WishlistProduct) {
    let sellerDetails = {
      productName: det.prod_name,
      sellerAccountId: det.pk_seller_account_id,
      sellerId: det.fk_seller_user_id,
      companyName: det.admin_user_company_name,
      companyLogo: det.company_name_logo,
      category_id: det.fk_cat_id,
      env: 'product',
      product_id: det.product_id,
      buyerSellerStatus: det.buyer_seller_status
    }
    return sellerDetails;
  }

  // multiple inquiry 
  selectedProducts: SelectedProduct[] = [];
  selectedSellers: SelectedSupplier[] = []
  multipleEnquiry() {
    this.productEnquiry();
    let multipleObj: MutipleObj = {
      type: "product",
      products: this.selectedProducts,
      suppliers: this.selectedSellers
    }
    const dialogRef = this.dialog.open(EnquiryMultipleComponent, {
      width: '700px',
      data: multipleObj
    });

    dialogRef.afterClosed().subscribe((_result: any) => {
      this.dynamicFields.reset();
      this.selectAll.reset();
      console.log('The dialog was closed');
    });
  }

  productEnquiry(): void {
    let selectedValues: boolean[] = this.dynamicFields.value;
    let products = this.products.filter((product, index) => selectedValues[index]);
    let mappedProducts: SelectedProduct[] = products.map(product => new Product(product.product_id, product.prod_img, product.prod_name));
    let mappedSuppliers: SelectedSupplier[] = products.map(product => new Seller(product.pk_seller_account_id, product.company_name_logo, product.admin_user_company_name));
    this.selectedProducts = mappedProducts;
    this.selectedSellers = mappedSuppliers;
  }

}
