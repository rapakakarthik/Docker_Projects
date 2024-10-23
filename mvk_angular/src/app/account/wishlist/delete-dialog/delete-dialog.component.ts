import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WishilistAddRemove } from 'src/app/shared/models/wishlist/wishlistAdd';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})

export class DeleteDialogComponent implements OnInit {

  readonly data = inject<{id: number, folder_id: number, name: string}>(MAT_DIALOG_DATA);
  private wserivce = inject(WishlistService);
  private toastr = inject(ToastrService);
  
  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>){}

  ngOnInit(): void {
   
  }

  confirmDalete(){
    this.deleteCompanyFromWishListAPI();
  }

  deleteCompanyFromWishListAPI() {
    let obj: WishilistAddRemove = {
      record_id: this.data.id,
      folder_id: this.data.folder_id,
      type: "seller",
      action: "remove"
    }
    this.wserivce.addRemoveProductCompany(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success("company removed from wishlist");
          this.closeDeleteDialog(true);
          // this.getCompanyByWishlistId(this.activeId);
          // this.getWishlistFolders();
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

  closeDeleteDialog(callApi: boolean){
    this.dialogRef.close(callApi)
  }
}
