import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnquiryMultipleComponent } from 'src/app/shared/components/enquiry-multiple/enquiry-multiple.component';
import { FolderData, WishlistData, WishlistResponse } from 'src/app/shared/models/wishlist/api-response';
import { WishListFolder } from 'src/app/shared/models/wishlist/wishlist-folder';
import { WishlistProduct } from 'src/app/shared/models/wishlist/wishlist-product';
import { SupplierProduct, WishilistSupplier } from 'src/app/shared/models/wishlist/wishlist-supplier';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AddComment, AddCommentSupplier } from 'src/app/shared/models/wishlist/wishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private wserivce = inject(WishlistService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(){
    this.getWishlistFolders(true);
    this.setupSelectAllControl();
    this.setupSelectArrayControls();
  }

  constructor(private dialog: MatDialog){}

  openDelete(supplierId: number, name: string) {
    // this.deleteCompanyFromWishListAPI(supplierId.toString());
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data : {id: supplierId, folder_id: 0, name}
    });

    dialogRef.afterClosed().subscribe((_res) => {
      if(_res) {
        this.getCompanyByWishlistId(this.activeId);
        this.getWishlistFolders(false);
      }
    })
  }


  @ViewChild('openDeleteDialog') openDeleteDialog!: TemplateRef<any>;
  openDeleteDialogRef!: MatDialogRef<any, any>;
  clickDelete(id: number, name: string) {
    this.listId = id;
    this.list_name = name;
    this.openDeleteDialogRef = this.dialog.open(this.openDeleteDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openDeleteDialogRef.afterClosed().subscribe((res: any) => {
      this.openDeleteDialogRef.close();
    });
  }

  closeDeleteDialog() {
    this.openDeleteDialogRef.close();
  }

  @ViewChild('openMoveDialog') openMoveDialog!: TemplateRef<any>;
  openMoveDialogRef!: MatDialogRef<any, any>;
  clickMove() {
    this.openMoveDialogRef = this.dialog.open(this.openMoveDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openMoveDialogRef.afterClosed().subscribe((res: any) => {
      this.openMoveDialogRef.close();
    });
  }

  closeMoveDialog() {
    this.openMoveDialogRef.close();
  }

  @ViewChild('openCreateListDialog') openCreateListDialog!: TemplateRef<any>;
  openCreateListDialogRef!: MatDialogRef<any, any>;
  clickCreateList(){
    this.openCreateListDialogRef = this.dialog.open(this.openCreateListDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openCreateListDialogRef.afterClosed().subscribe((res: any) => {
      this.listName.reset();
    });
  }

  closeCreateListDialog() {
    this.openCreateListDialogRef.close();
  }
  
  @ViewChild('openUpdateListDialog') openUpdateListDialog!: TemplateRef<any>;
  openUpdateListDialogRef!: MatDialogRef<any, any>;
  clickUpdateList(id: number, name: string){
    this.listId = id;
    this.listName.setValue(name);
    this.list_name = name;
    this.openUpdateListDialogRef = this.dialog.open(this.openUpdateListDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openUpdateListDialogRef.afterClosed().subscribe((res: any) => {
      this.listName.reset();
    });
  }

  closeUpdateListDialog() {
    this.openUpdateListDialogRef.close();
  }

  @ViewChild('openManageListDialog') openManageListDialog!: TemplateRef<any>;
  openManageListDialogRef!: MatDialogRef<any, any>;
  clickMore(){
    this.setupManageSelectArrayControls();
    this.openManageListDialogRef = this.dialog.open(this.openManageListDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openManageListDialogRef.afterClosed().subscribe((res: any) => {
      this.openManageListDialogRef.close();
    });
  }

  closeManageListDialog() {
    this.openManageListDialogRef.close();
  }

  @ViewChild('openCmntQtyDialog') openCmntQtyDialog!: TemplateRef<any>;
  openCmntQtyDialogRef!: MatDialogRef<any, any>;
  clickCmntQty(product: WishlistProduct){
    this.activeProduct = product;
    this.comment = product.wishlist_comment;
    this.quantity = product.wishlist_quantity || "";
    this.openCmntQtyDialogRef = this.dialog.open(this.openCmntQtyDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openCmntQtyDialogRef.afterClosed().subscribe((res: any) => {
      this.openCmntQtyDialogRef.close();
    });
  }

  closeCmntQtyDialog() {
    this.openCmntQtyDialogRef.close();
  }

  @ViewChild('openShareListDialog') openShareListDialog!: TemplateRef<any>;
  openShareListDialogRef!: MatDialogRef<any, any>;
  clickShare(){
    this.openShareListDialogRef = this.dialog.open(this.openShareListDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openShareListDialogRef.afterClosed().subscribe((res: any) => {
      this.copyText = "Copy Link";
    });
  }

  closeShareListDialog() {
    this.openShareListDialogRef.close();
  }

  viewClass: string = 'list_view'; // Default class

  listView(): void {
    this.viewClass = 'list_view';
  }

  gridView(): void {
    this.viewClass = 'grid_view';
  }

  inputText: string = '';
  inputLength: number = 0;

  updateLength(): void {
    this.inputLength = this.inputText.length;
  } 

  showLink = true;

  clickViewLink(show: boolean){
    this.showLink = show;
    this.copyText = "Copy Link"
  }

  dialogRef: any;
  multipleEnquiry(type: unitType) {
    let multipleObj: MutipleObj = {
      type,
      products: [],
      suppliers: []
    }
    if(type === 'seller') {
      multipleObj.suppliers = this.selectedSellers
    } else {
      multipleObj.suppliers = this.selectedSellers
      multipleObj.products = this.selectedProducts
    }
    this.dialogRef = this.dialog.open(EnquiryMultipleComponent, {
      width: '700px',
      data: multipleObj
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.dynamicFields.reset();
      this.selectAll.reset();
      console.log('The dialog was closed');
    });
  }

  // wishlist Logic code
  listId: number = 0;
  list_name: string = ''

  // Wishlist forms and controls

  listName = new FormControl('', Validators.required);
  moveToGroup = new FormControl('default');
  moveTo = new FormControl('default');
  
  // wishlist api implementaions

  createWishlist() {
    let list_name = this.listName.value as string;
    this.wserivce.createWishlistFolder(list_name).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.closeCreateListDialog();
          this.toastr.success(value.message);
          this.getWishlistFolders(false);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }

  editWishlist(id: number) {
    let list_name = this.listName.value as string;
    this.wserivce.editWishlistFolder(list_name, id).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.listName.reset();
          this.closeUpdateListDialog();
          this.toastr.success(value.message);
          this.getWishlistFolders(false);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }

  deleteWishList(id: number) {
    this.wserivce.deleteWishlistFolder(id).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.toastr.success(value.message);
          this.closeDeleteDialog();
          this.getWishlistFolders(true);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }

  wishListFolders: WishListFolder[] = [];
  wishListDataFound = false;
  getWishlistFolders(callProducts: boolean) {
    let obj: {type: 1 | 2, limit: number, skip: number} = {
      type: this.showProducts ? 1 : 2,
      skip: 0,
      limit: 10
    }
    this.wserivce.getWishlistFoldersData(obj).subscribe({
      next: (value: WishlistData<WishListFolder>) => {
        if(value.status == 200) {
          this.wishListDataFound = true;
          this.wishListFolders = value.data;
          this.addControlToMangeList(value.data);
          if(callProducts) {
            this.activeId = 0;
            if(!this.showProducts) {
              this.setupSelectAllControlCompany();
              this.setupSelectArrayControlsCompany();
              this.getCompanyByWishlistId(0);
            } else {
              this.getProductsByWishlistId(0);
            }
          }
        } else {
          this.wishListDataFound = false;
          // this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.wishListDataFound = false;
      },
    })
  }

  activeId = 0;










  // Products api implementation

  productDataFound = false;
  products: WishlistProduct[] = [];
  productsLoader = false;
  limit: number = 8;
  skip: number = 0;
  folderData!: FolderData;
  getProductsByWishlistId(id: number) {
    this.activeId = id;
    let getWishlistObj = {
      limit: this.limit,
      skip: this.skip,
      folder_id: id
    }
    this.productsLoader = true;
    this.oneSelected = false
    this.wserivce.getProductsByWishlistId(getWishlistObj).subscribe({
      next: (value: WishlistData<WishlistProduct>) => {
        this.productsLoader = false;
        this.showCompare = false;
        if(value.status == 200) {
          this.productDataFound = true;
          this.addFormControls(value.data);
          this.totalCount = value.product_count;
          this.products = value.data;
          this.folderData = value.folder_data;
          this.dynamicFields.reset();
          this.selectAll.reset();
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

  isFavProduct = false;
  moveProductsToWishlist(folderId: number) {
    let selectedIds = this.getSelectedIds();
    this.moveProductsToWishlistAPI(selectedIds, folderId);
  }

  moveProductToWishlist(productId: number, fromFolderId: number) {
    this.moveProductsToWishlistAPI(productId.toString(), fromFolderId);
  }

  moveProductsToWishlistAPI(productId: string, folderId: number) {
    this.wserivce.moveProductsToWishlist(productId, this.activeId, folderId, 0).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Products moved to wishlist");
          this.getProductsByWishlistId(this.activeId);
          this.getWishlistFolders(false);
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
    this.deleteProductFromWishListAPI(selectedIds, this.activeId);
  }

  deleteProductFromWishlist(productId: number) {
    this.deleteProductFromWishListAPI(productId.toString(), this.activeId);
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
        if (res.status === 200) {
          this.toastr.success("Products removed from wishlist");
          this.getWishlistFolders(false);
          this.getProductsByWishlistId(this.activeId);
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("Products remove multi error msg", err.error)
      }
    })
  }


  // Reactive forms for selecting products;

  selectedIds: number[] = [];
  
  selectForm = this.fb.group({
    selectAll: [false],
    select: this.fb.array([])
  });

  get dynamicFields() {
    return this.selectForm.get('select') as FormArray;
  }
  get selectAll() {
    return this.selectForm.get('selectAll') as FormControl;
  }

  addFormControls(products: WishlistProduct[]): void {
    this.dynamicFields.clear();
    products.forEach(() => {
      this.dynamicFields.push(this.fb.control(false));
    });
  }

  setupSelectAllControl(): void {
    this.selectAll.valueChanges.subscribe(value => {
      this.oneSelected = value;
      let selectedCount = 0;      
      this.dynamicFields.controls.forEach(control => {
        if (control) selectedCount++;
        control.setValue(value, { emitEvent: false });
      });
      this.twoSelected = selectedCount >= 2;
    });
    this.moveToGroup.valueChanges.subscribe(id => {
      if(id && id !== "default") {
        this.moveToGroup.setValue("default");
        this.moveProductsToWishlist(parseInt(id));
      }
    }); 
  }

  onGroupChange(productId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const groupId = target.value;
    if(groupId && groupId != "default") {
      this.moveTo.setValue("default");
      this.moveProductToWishlist(productId, parseInt(groupId));
    }
  }

  // Set up listeners for the FormArray controls
  oneSelected = false;
  twoSelected = false;
  setupSelectArrayControls(): void {
    this.dynamicFields.valueChanges.subscribe((values: boolean[]) => {

      let allSelected = true;
      let oneSelected = false;
      let selectedCount = 0;

      for (const control of values) {
        if (control) {
          selectedCount++;
          oneSelected = true;
        } else {
          allSelected = false;
        }
      }
      
      this.oneSelected = oneSelected;
      this.twoSelected = selectedCount >= 2;
      
      // const allSelected = values.every(control => control);
      // this.oneSelected = values.some(control => control);
      // const selectedCount = values.filter(control => control).length;
      // this.twoSelected = selectedCount >= 2;
      this.selectAll.setValue(allSelected, { emitEvent: false });
    });
  }

  // changeSelection(selected: boolean) {
  //   this.oneSelected = selected
  // }

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
    // console.log(selectedIdsStr);
    return selectedIdsStr;
  }

  inquiryProductsCompany(): void {
    let selectedValues: boolean[] = this.dynamicFields.value;
    let products = this.products.filter((product, index) => selectedValues[index]);
    let mappedProducts: SelectedProduct[] = products.map(product => new Product(product.product_id, product.prod_img, product.prod_name));
    let mappedSuppliers: SelectedSupplier[] = products.map(product => new Seller(product.pk_seller_account_id, product.company_name_logo, product.admin_user_company_name));
    this.selectedProducts = mappedProducts;
    this.selectedSellers = mappedSuppliers;
  }


  // For contact supplier code

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
    }
    return sellerDetails;
  }

  // For multi contact supplier code 
  multiSendInquiryProducts() {
    this.inquiryProductsCompany();
    this.multipleEnquiry('product');
  }


  // share funcationality
  share(product: WishlistProduct) {
    let product_name = encodeURIComponent(product.prod_name).toLowerCase();
    let urlG = window.location.origin + '/product/' + product_name + "-" + product.product_id;
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

  goToProduct(product: WishlistProduct) {
    let product_name = encodeURIComponent(product.prod_name).toLowerCase();
    let urlG = product_name + "-" + product.product_id;
    this.router.navigate(['/product', urlG]);
  }

  // Product Comment 
  comment = '';
  quantity: string | number = '';
  activeProduct!: WishlistProduct;

  addComment() {
    if(this.comment == '') {
      this.toastr.error("Please enter comment");
      return;
    }
    if(this.quantity == '') {
      this.toastr.error("Please enter Quantity");
      return;
    }
    if(+this.quantity <= 0) {
      this.toastr.error("Quantity must be greater than zero");
      return;
    }
    let obj: AddComment = {
      product_id: this.activeProduct.product_id,
      folder_id: this.activeId,
      quantity: +this.quantity,
      comment: this.comment,
      shared: 0
    }
    this.wserivce.addProductComment(obj).subscribe({
      next: (value) => {
        if(value.status == 200) {
          let id = this.products.findIndex(supplier => supplier.product_id == obj.product_id);
          this.products[id].wishlist_comment = obj.comment;
          this.products[id].wishlist_quantity = obj.quantity;
          this.toastr.success(value.message);
          this.closeCmntQtyDialog();
        } 
      },
      error: (err: HttpErrorResponse) => {
        // error handling
      },
    })
    // console.log(obj)

  }


  // Compare products

  selectedId: string = '';
  compareProducts() {
    this.selectedId = this.getSelectedIds();
    this.showCompare = true;
    this.dynamicFields.controls.forEach(control => {
      control.setValue(false, { emitEvent: false });
    });
    this.selectAll.setValue(false, { emitEvent: false });
  }


  // Wishilist code
  showProducts = true;

  activeSuppliers(activeS: boolean) {
    this.showProducts = !activeS;
    if(this.showProducts) {
      this.productsLoader = true;
    } else {
      this.suppliersLoader = true;
    }
    this.getWishlistFolders(true);
  }

  getProductsCompany(folder_id: number) {
    if(this.showProducts) {
      this.getProductsByWishlistId(folder_id);
    }
    else {
      this.getCompanyByWishlistId(folder_id);
    }
  }



  // Suppliers code 
  
  supplierDataFound = false;
  suppliers: WishilistSupplier[] = [];
  suppliersLoader = false;
  supplierLimit: number = 8;
  supplierSkip: number = 0;
  getCompanyByWishlistId(id: number) {
    this.activeId = id;
    let getWishlistObj = {
      limit: this.limit,
      skip: this.skip,
      folder_id: id
    }
    this.suppliersLoader = true;
    this.wserivce.getCompanyByWishlistId(getWishlistObj).subscribe({
      next: (value: WishlistData<WishilistSupplier>) => {
        this.suppliersLoader = false;
        if(value.status == 200) {
          this.supplierDataFound = true;
          // this.addFormControls(value.data);
          this.suppliers = value.data;
          this.folderData = value.folder_data;
          this.addFormControlsCompany(value.data);
          // this.dynamicFields.reset();
          // this.selectAll.reset();
        } else {
          this.supplierDataFound = false;
          // this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.suppliersLoader = false;
        this.supplierDataFound = false;
      },
    })
  }

  // Comapare code 
  showCompare = false;
  hideCompare() {
    this.showCompare = false;
    this.getWishlistFolders(false);
    this.getProductsByWishlistId(this.activeId);
  }


  // Suppliers code 

  selectedIdsCompany: number[] = [];
  
  // Reactive forms for selecting Companies;
  moveToGroupCompany = new FormControl('default');
  moveToCompany = new FormControl('default');
  
  selectFormCompany = this.fb.group({
    selectAll: [false],
    select: this.fb.array([])
  });

  get selectCompany() {
    return this.selectFormCompany.get('select') as FormArray;
  }
  get selectAllCompany() {
    return this.selectFormCompany.get('selectAll') as FormControl;
  }

  addFormControlsCompany(companies: WishilistSupplier[]): void {
    this.selectCompany.clear();
    companies.forEach(() => {
      this.selectCompany.push(this.fb.control(false));
    });
  }

  setupSelectAllControlCompany(): void {
    this.selectAllCompany.valueChanges.subscribe(value => {
      this.oneSelectedCompany = value;
      this.selectCompany.controls.forEach(control => {
        control.setValue(value, { emitEvent: false });
      });
    });
    this.moveToGroupCompany.valueChanges.subscribe(id => {
      if(id && id !== "default") {
        this.moveToGroupCompany.setValue("default");
        this.moveSuppliersToWishlist(parseInt(id));
      }
    }); 
  }

  onGroupChangeCompany(companyId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const groupId = target.value;
    if(groupId && groupId != "default") {
      this.moveToCompany.setValue("default");
      this.moveSupplierToWishlist(companyId, parseInt(groupId));
    }
  }

  // Set up listeners for the FormArray controls
  oneSelectedCompany = false;
  setupSelectArrayControlsCompany(): void {
    this.selectCompany.valueChanges.subscribe((values: boolean[]) => {
      const allSelected = values.every(control => control);
      this.oneSelectedCompany = values.some(control => control);
      this.selectAllCompany.setValue(allSelected, { emitEvent: false });
    });
  }

  checkedSuppliers: WishilistSupplier[] = [];
  getSelectedIdsCompany(): string {
    let selectedValues: boolean[] = this.selectCompany.value;
    selectedValues.forEach((value: boolean, i: number) => {
      let companyId = this.suppliers[i].seller_id;
      if(value) {
        if(!this.selectedIdsCompany.includes(companyId)) {
          this.selectedIdsCompany.push(companyId);
          this.checkedSuppliers.push(this.suppliers[i]);
        }
      } else {
        if(this.selectedIdsCompany.includes(companyId)) {
          let index = this.selectedIdsCompany.findIndex(id => id == companyId);
          this.selectedIdsCompany.splice(index, 1);
        }
      }
    })
    let selectedIdsStr = this.selectedIdsCompany.join(',');
    // console.log(selectedIdsStr);
    return selectedIdsStr;
  }

  // delete supplier form folder 
  deleteCompaniesFromWishlist() {
    let selectedIds = this.getSelectedIdsCompany();
    this.deleteCompanyFromWishListAPI(selectedIds);
  }

  deleteSupplierFromWishlist(supplierId: number) {
    this.deleteCompanyFromWishListAPI(supplierId.toString());
  }

  deleteCompanyFromWishListAPI(supplierId: string) {
    let obj: WishilistAddRemove = {
      record_id: supplierId,
      folder_id: this.activeId,
      type: "seller",
      action: "remove"
    }
    this.wserivce.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("company removed from wishlist");
          this.getCompanyByWishlistId(this.activeId);
          this.getWishlistFolders(false);
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("Products remove multi error msg", err.error)
      }
    })
  }


  // for moving multi suppliers
  moveSuppliersToWishlist(folderId: number) {
    let selectedIds = this.getSelectedIdsCompany();
    this.moveSuppliersToWishlistAPI(selectedIds, folderId);
  }

  // for moving single supplier
  moveSupplierToWishlist(supplierId: number, fromFolderId: number) {
    this.moveSuppliersToWishlistAPI(supplierId.toString(), fromFolderId);
  }

  // move suppliers to wishlist api 
  moveSuppliersToWishlistAPI(sellerId: string, folderId: number) {
    this.wserivce.moveSuppliersToWishlist(sellerId, this.activeId, folderId, 0).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Suppliers moved to wishlist");
          this.getCompanyByWishlistId(this.activeId);
          this.getWishlistFolders(false);
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        console.error("Suppliers multi addFav error msg", err.error)
      }
    })
  }

  // share funcationality
  shareCompany(supplier: WishilistSupplier) {
    let companyName = encodeURIComponent(supplier.seller_company_name).toLowerCase();
    let urlG = window.location.origin + '/company/' + companyName + "-" + supplier.seller_id;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this supplier!',
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

  // Supplier Comment 
  commentSupplier = '';
  quantitySupplier = "";
  activeSupplier!: WishilistSupplier;

  addCommentSupplier() {
    if(this.commentSupplier == '') {
      this.toastr.error("Please enter comment");
      return;
    }
    if(this.quantitySupplier == '') {
      this.toastr.error("Please enter Quantity");
      return;
    }
    if(+this.quantitySupplier <= 0) {
      this.toastr.error("Quantity must be greater than zero");
      return;
    }
    let obj: AddCommentSupplier = {
      seller_id: this.activeSupplier.seller_id,
      folder_id: this.activeId,
      quantity: +this.quantitySupplier,
      comment: this.commentSupplier,
      shared: 0
    }
    // console.log(obj)
    this.wserivce.addSupplierComment(obj).subscribe({
      next: (value) => {
        if(value.status == 200) {
          let id = this.suppliers.findIndex(supplier => supplier.seller_id == obj.seller_id);
          this.suppliers[id].wishlist_comment = obj.comment;
          this.suppliers[id].wishlist_quantity = obj.quantity;
          this.closeCmntQtyDialogSupplier();
          this.toastr.success(value.message);
        } 
      },
      error: (err: HttpErrorResponse) => {
        // error handling
      },
    })
  }
  
  @ViewChild('openCmntQtyDialogSupplier') openCmntQtyDialogSupplier!: TemplateRef<any>;
  openCmntQtyDialogSupplierRef!: MatDialogRef<any, any>;
  clickCmntQtySupplier(supplier: WishilistSupplier){
    this.activeSupplier = supplier;
    this.commentSupplier = supplier.wishlist_comment;
    this.quantitySupplier = supplier.wishlist_quantity.toString();
    this.openCmntQtyDialogSupplierRef = this.dialog.open(this.openCmntQtyDialogSupplier, {
      width: '450px',
      // disableClose: true,
    });

    this.openCmntQtyDialogSupplierRef.afterClosed().subscribe((res: any) => {
      // this.openCmntQtyDialogSupplierRef.close();
    });
  }

  closeCmntQtyDialogSupplier() {
    this.openCmntQtyDialogSupplierRef.close();
  }


  // Multiple Inquiry company 
  selectedSellers: SelectedSupplier[] = []
  selectedProducts: SelectedProduct[] = [];

  inquiryCompanyInit(): void {
    let selectedValues: boolean[] = this.selectCompany.value;
    let sellers = this.suppliers.filter((seller, index) => selectedValues[index]);
    let mappedSuppliers: SelectedSupplier[] = sellers.map(seller => new Seller(seller.seller_id, seller.company_name_logo, seller.seller_company_name));
    this.selectedSellers = mappedSuppliers;
  }
  sendMultipleInquiryCompany() {
    this.inquiryCompanyInit();
    this.multipleEnquiry('seller');
  }

  // Shared Wishilist code
  showShared = false;

  activeMyList(activeS: boolean) {
    this.showShared = !activeS;
    // this.getWishlistFolders();
    // if(activeS) {
    //   this.setupSelectAllControlCompany();
    //   this.setupSelectArrayControlsCompany();
    //   this.getCompanyByWishlistId(0);
    // } else {
    //   this.getProductsByWishlistId(0);
    // }
  }

  copyText = "Copy Link";
  copyShareLink() {
    const link = this.generateLink();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        this.copyText = "Link Copied"
        console.log('Text copied to clipboard');
        // Optionally, provide feedback to the user
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Handle any errors here
      });
    } else {
      console.warn('Clipboard API not supported');
    }
  }

  openEmailClient() {
    const recipient = 'recipient@example.com';
    const subject = `Share List ${this.folderData.name}`;
    const link = this.generateLink();
    
    // Encode the subject and body to ensure special characters are handled properly
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(link);

    // Create the mailto link
    const mailtoLink = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open the default email client with the composed email
    window.open(mailtoLink);
  }

  generateLink(): string {
    let editToken = this.folderData.edit_link;
    let viewToken = this.folderData.view_link;
    let token = this.showLink ? viewToken : editToken;
    let type = this.showProducts ? "products" : "suppliers";
    if(this.showLink) { // this.showLink === view link
      let link = window.location.origin + `/wishlist-view/${type}/${token}`;
      return link;
    }
    let link = window.location.origin + `/wishlist-invite/${token}`;
    return link;
  }

  @ViewChild('openListMembersDialog') openListMembersDialog!: TemplateRef<any>;
  openListMembersDialogRef!: MatDialogRef<any, any>;
  viewMembers(event: Event, users: any[], owner_name: string, folder_id: number){
    event.stopPropagation();
    this.sharedFolderId = folder_id;
    this.setMembers(users, owner_name);
    this.openListMembersDialogRef = this.dialog.open(this.openListMembersDialog, {
      width: '450px',
      // disableClose: true,
    });

    this.openListMembersDialogRef.afterClosed().subscribe((res: any) => {
      this.openListMembersDialogRef.close();
    });
  }

  closelistMembersDialog() {
    this.openListMembersDialogRef.close();
  }
  
  sharedMembers: any[] = [];
  sharedListOwner: string = ''
  setMembers(members: any[], owner_name: string) {
    this.sharedMembers = members;
    this.sharedListOwner = owner_name;
  }
  
  sharedFolderId: number = 0;
  removeMember(id: number) {
    this.wserivce.removeMemberApi(id, this.sharedFolderId).subscribe({
      next: (value) => {
        if(value.status == 200) {
          // this.productList = this.productList.map(members => members.filter(member => member.id !== id));
          this.closelistMembersDialog();
        } 
      },
      error: (err: HttpErrorResponse) => {
        // error handling
      },
    })
  }

  // manage wishlist code 
  manageListForm = this.fb.group({
    select: this.fb.array([])
  });

  get manageSelect() {
    return this.manageListForm.get('select') as FormArray;
  }

  addControlToMangeList(folders: WishListFolder[]): void {
    this.manageSelect.clear();
    folders.forEach((folder) => {
      this.manageSelect.push(this.createManageListEditForm(folder));
    });
  }

  createManageListEditForm(folder: WishListFolder) {
    return this.fb.group({
      name: [folder.name],
      checkbox: [false]
    })
  }

  // Set up listeners for the FormArray controls
  oneSelectedInMangeList = false;
  setupManageSelectArrayControls(): void {
    this.manageSelect.valueChanges.subscribe((values: {name: string, checkbox: boolean}[]) => {
      this.oneSelectedInMangeList = values.some(control => control.checkbox);
    });
  }

  getSelectedIdsManageList(): string {
    let selectedValues: {name: string, checkbox: boolean}[] = this.manageSelect.value;
    let selectedFolderIds: number[] = [];

    selectedValues.forEach((v, i) => {
      let folderId = this.wishListFolders[i].id;
      if(v.checkbox) selectedFolderIds.push(folderId);
    })
    
    let selectedIdsStr = selectedFolderIds.join(',');
    return selectedIdsStr;
  }

  deleteSelectedList() {
    let ids: string = this.getSelectedIdsManageList();

    this.wserivce.deleteWishlistFolder(ids).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.toastr.success(value.message);
          this.closeManageListDialog();
          this.getWishlistFolders(true);
          // this.getProductsByWishlistId(0);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }

  editManageList() {
    let folders: {name: string, checkbox: boolean}[] = this.manageSelect.value
    let apiRequestObj:{name: string, id: number}[]  = [];
    folders.forEach((folder, index) => {
      if(!folder.name) {
        this.toastr.error("folder name must not be empty");
      }
      apiRequestObj.push({name: folder.name, id: this.wishListFolders[index].id});
    })

    this.wserivce.editManageList(apiRequestObj).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.toastr.success(value.message);
          this.closeManageListDialog();
          this.getWishlistFolders(true);
          // this.getProductsByWishlistId(0);
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
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

  // change pagination
  p: number = 0;
  totalCount = 0
  onPageChangeProducts(pageNumber: number) {
    window.scrollTo(0, 0);
    this.p = pageNumber;
    this.skip = (pageNumber - 1) * 8;
    this.getProductsByWishlistId(this.activeId);
  }

}


export interface SelectedSupplier {
  id: number,
  image: string,
  name: string
}

export interface SelectedProduct {
  id: number,
  image: string,
  name: string
}

type unitType = 'product' | 'seller'
export interface MutipleObj {
  type: unitType,
  suppliers: SelectedSupplier[],
  products: SelectedProduct[]
}

export class Product implements SelectedProduct{
  id: number;
  image: string;
  name: string;

  constructor(id: number, image: string, name: string) {
    this.id = id;
    this.image = image;
    this.name = name;
  }
}
export class Seller implements SelectedSupplier{
  id: number;
  image: string;
  name: string;

  constructor(id: number, image: string, name: string) {
    this.id = id;
    this.image = image;
    this.name = name;
  }
}
