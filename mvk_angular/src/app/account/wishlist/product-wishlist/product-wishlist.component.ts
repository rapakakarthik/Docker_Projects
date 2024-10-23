import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EnquiryMultipleComponent } from 'src/app/shared/components/enquiry-multiple/enquiry-multiple.component';
import { WishlistData, WishlistResponse } from 'src/app/shared/models/wishlist/api-response';
import { WishListFolder } from 'src/app/shared/models/wishlist/wishlist-folder';
import { WishlistProduct } from 'src/app/shared/models/wishlist/wishlist-product';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrl: './product-wishlist.component.scss'
})
export class ProductWishlistComponent implements OnInit, OnChanges {


  // Inputs 
  @Input({required: true})  products: WishlistProduct[] = [];

  
  
  private wserivce = inject(WishlistService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);

  private myWisListId: number = 0;
  
  ngOnInit(){
    // this.getWishlistFolders();
    // this.getProductsByWishlistId(this.myWisListId);
    this.setupSelectAllControl();
    this.setupSelectArrayControls();
  }

  constructor(private dialog: MatDialog){}
  ngOnChanges(changes: SimpleChanges): void {
    this.addFormControls(this.products);
    this.dynamicFields.reset();
    this.selectAll.reset();
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
  clickCmntQty(){
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
      this.openShareListDialogRef.close();
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

  showLink = false;

  clickViewLink(){
    this.showLink = true;
  }

  dialogRef: any;
  multipleEnquiry() {
    this.dialogRef = this.dialog.open(EnquiryMultipleComponent, {
      width: '700px',
      // data: this.sellerDetails
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
  }

  // wishlist Logic code
  listId: number = 0;
  list_name: string = ''

  // Wishlist forms and controls

  listName = new FormControl('', Validators.required);
  moveToGroup = new FormControl('0');
  moveTo = new FormControl('0');
  
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
        
      },
    })
  }

  wishListFolders: WishListFolder[] = [];
  wishListDataFound = false;
  getWishlistFolders() {
    // this.wserivce.getWishlistFolders().subscribe({
    //   next: (value: WishlistData<WishListFolder>) => {
    //     if(value.status == 200) {
    //       this.wishListDataFound = true;
    //       this.wishListFolders = value.data;
    //     } else {
    //       this.wishListDataFound = false;
    //       // this.toastr.error(value.message);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.wishListDataFound = false;
    //   },
    // })
  }

  activeId = 0;










  // Products api implementation

  productDataFound = false;
  // products: WishlistProduct[] = [];
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
    this.wserivce.moveProductsToWishlist(productId, this.activeId, folderId, 0).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("Products moved to wishlist");
          // this.getProductsByWishlistId(this.activeId);
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
    // this.wserivce.removeProductFromWishlist(productId, this.activeId).subscribe({
    //   next: (res: any) => {
    //     if (res.status === 200) {
    //       this.toastr.success("Products removed from wishlist");
    //       // this.getProductsByWishlistId(this.activeId);
    //     }
    //     else {
    //       this.toastr.error(res.message);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.toastr.error('Internal server error')
    //     console.error("Products remove multi error msg", err.error)
    //   }
    // })
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

  onGroupChange(productId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const groupId = target.value;
    if(groupId && groupId != "0") {
      this.moveTo.setValue("0");
      this.moveProductToWishlist(productId, parseInt(groupId));
    }
  }

  // Set up listeners for the FormArray controls
  setupSelectArrayControls(): void {
    this.dynamicFields.valueChanges.subscribe((values: boolean[]) => {
      const allSelected = values.every(control => control);
      this.selectAll.setValue(allSelected, { emitEvent: false });
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
    // console.log(selectedIdsStr);
    return selectedIdsStr;
  }


  // For contact supplier code

  getSellerDetails(det: WishlistProduct) {
    let sellerDetails = {
      productName: det.prod_name,
      sellerAccountId: det.pk_seller_account_id,
      sellerId: det.fk_seller_user_id,
      companyName: det.admin_user_company_name,
      companyLogo: det.company_name_logo,
      // category_id: det.,
      env: 'product',
      product_id: det.product_id,
      // buyerSellerStatus: det.
    }
    return sellerDetails;
  }

}
