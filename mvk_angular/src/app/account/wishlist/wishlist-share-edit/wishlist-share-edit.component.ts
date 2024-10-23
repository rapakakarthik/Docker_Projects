import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnquiryMultipleComponent } from 'src/app/shared/components/enquiry-multiple/enquiry-multiple.component';
import { WishlistData, WishlistResponse } from 'src/app/shared/models/wishlist/api-response';
import { WishListFolder } from 'src/app/shared/models/wishlist/wishlist-folder';
import { WishlistProduct } from 'src/app/shared/models/wishlist/wishlist-product';
import { SupplierProduct, WishilistSupplier } from 'src/app/shared/models/wishlist/wishlist-supplier';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { AddComment, AddCommentSupplier } from 'src/app/shared/models/wishlist/wishlist';

@Component({
  selector: 'app-wishlist-share-edit',
  templateUrl: './wishlist-share-edit.component.html',
  styleUrl: './wishlist-share-edit.component.scss'
})
export class WishlistShareEditComponent implements OnInit {

  private wserivce = inject(WishlistService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private myWisListId: number = 0;
  
  ngOnInit(){
    this.getWishlistFolders();
    this.getMyWishlistFolders();
    this.setupSelectAllControl();
    this.setupSelectArrayControls();
  }

  constructor(private dialog: MatDialog){}

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

  @ViewChild('openListMembersDialog') openListMembersDialog!: TemplateRef<any>;
  openListMembersDialogRef!: MatDialogRef<any, any>;
  viewMembers(users: any[], owner_name: string, folder_id: number,event?: Event){
    if(event) event.stopPropagation();
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

  viewMembersFn() {
    let folder = this.wishListFolders.find(list => list.id == this.activeId);
    let owner_name: string = folder?.owner.name ?? "-";
    let users = folder?.users ?? [];
    this.viewMembers(users, owner_name, this.activeId);
  }
  
  sharedFolderId: number = 0;

  @ViewChild('openCmntQtyDialog') openCmntQtyDialog!: TemplateRef<any>;
  openCmntQtyDialogRef!: MatDialogRef<any, any>;
  clickCmntQty(product: WishlistProduct){
    this.activeProduct = product;
    this.comment = product.wishlist_comment;
    this.quantity = product.wishlist_quantity ?? "";
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

  // @ViewChild('openShareListDialog') openShareListDialog!: TemplateRef<any>;
  // openShareListDialogRef!: MatDialogRef<any, any>;
  // clickShare(){
  //   this.openShareListDialogRef = this.dialog.open(this.openShareListDialog, {
  //     width: '450px',
  //     // disableClose: true,
  //   });

  //   this.openShareListDialogRef.afterClosed().subscribe((res: any) => {
  //     this.openShareListDialogRef.close();
  //   });
  // }

  // closeShareListDialog() {
  //   this.openShareListDialogRef.close();
  // }

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

  showLink = false;

  clickViewLink(){
    this.showLink = true;
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
          this.getWishlistFolders();
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => { 
        this.toastr.error("Internal server error");
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
          this.getWishlistFolders();
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Internal server error");
      },
    })
  }

  deleteWishList(id: number) {
    this.wserivce.deleteWishlistFolder(id).subscribe({
      next: (value: WishlistResponse) => {
        if(value.status == 200) {
          this.toastr.success(value.message);
          this.closeDeleteDialog();
          this.getWishlistFolders();
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Internal server error");
      },
    })
  }

  wishListFolders: WishListFolder[] = [];
  wishListDataFound = false;
  getWishlistFolders() {
    let obj: {type: 1 | 2, limit: number, skip: number, shared: number} = {
      type: this.showProducts ? 1 : 2,
      skip: 0,
      limit: 10,
      shared: 1
    }
    this.wserivce.getWishlistFoldersData(obj).subscribe({
      next: (value: WishlistData<WishListFolder>) => {
        if(value.status == 200) {
          this.wishListDataFound = true;
          this.wishListFolders = value.data;
          if(value.data.length > 0) {
            if(!this.showProducts) {
              this.setupSelectAllControlCompany();
              this.setupSelectArrayControlsCompany();
              this.getCompanyByWishlistId(value.data[0].id);
            } else {

              this.getProductsByWishlistId(value.data[0].id);
            }
          }
        } else {
          this.wishListFolders = [];
          this.productDataFound = false;
          this.supplierDataFound = false;
          this.wishListDataFound = false;
          // this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.wishListDataFound = false;
        this.wishListFolders = [];
      },
    })
  }

  myWishListFolders: WishListFolder[] = [];
  myWishListDataFound = false;
  getMyWishlistFolders() {
    let obj: {type: 1 | 2, limit: number, skip: number, shared: number} = {
      type: this.showProducts ? 1 : 2,
      skip: 0,
      limit: 10,
      shared: 0
    }
    this.wserivce.getWishlistFoldersData(obj).subscribe({
      next: (value: WishlistData<WishListFolder>) => {
        if(value.status == 200) {
          this.myWishListDataFound = true;
          this.myWishListFolders = value.data;
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

  // active folder id
  activeId = 0;










  // Products api implementation

  productDataFound = false;
  products: WishlistProduct[] = [];
  productsLoader = false;
  limit: number = 8;
  skip: number = 0;
  getProductsByWishlistId(id: number) {
    this.activeId = id;
    let getWishlistObj = {
      limit: this.limit,
      skip: this.skip,
      folder_id: id
    }
    this.productsLoader = true;
    this.wserivce.getProductsByWishlistId(getWishlistObj).subscribe({
      next: (value: WishlistData<WishlistProduct>) => {
        this.productsLoader = false;
        this.showCompare = false;
        if(value.status == 200) {
          this.productDataFound = true;
          this.addFormControls(value.data);
          this.products = value.data;
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
    this.wserivce.moveProductsToWishlist(productId, this.activeId, folderId, 1).subscribe({
      next: (res: any) => {
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
      this.dynamicFields.controls.forEach(control => {
        control.setValue(value, { emitEvent: false });
      });
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
  setupSelectArrayControls(): void {
    this.dynamicFields.valueChanges.subscribe((values: boolean[]) => {
      const allSelected = values.every(control => control);
      this.oneSelected = values.some(control => control);
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
      shared: 1
    }
    this.wserivce.addProductComment(obj).subscribe({
      next: (value) => {
        if(value.status == 200) {
          let id = this.products.findIndex(supplier => supplier.product_id == obj.product_id);
          this.products[id].wishlist_comment = obj.comment;
          this.products[id].wishlist_quantity = obj.quantity;
          this.closeCmntQtyDialog();
          this.toastr.success(value.message);
        } else {
          this.toastr.error(value.message)
        } 
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Internal server error");
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
    this.getWishlistFolders();
  }

  permission: string = "edit";
  getProductsCompany(folder_id: number, permission: string) {
    this.permission = permission;
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
    this.getWishlistFolders();
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
          this.getWishlistFolders();
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
    this.wserivce.moveSuppliersToWishlist(sellerId, this.activeId, folderId, 1).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Suppliers moved to wishlist");
          this.getCompanyByWishlistId(this.activeId);
          this.getWishlistFolders();
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
      shared: 1
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
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
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

  // new code 
  removeListFromShared(id: number) {
    this.wserivce.removeListFromShared(id).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.toastr.success(value.message);
          this.closeDeleteDialog();
          this.getWishlistFolders();
        } else {
          this.toastr.error(value.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Internal server error')
        // error handling
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

