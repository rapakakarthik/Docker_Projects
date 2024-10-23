import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-popup-confirm',
  templateUrl: './delete-popup-confirm.component.html',
  styleUrl: './delete-popup-confirm.component.scss'
})
export class DeletePopupConfirmComponent implements OnInit{

  private auth = inject(AuthenticationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  constructor(
    public dialogRef: MatDialogRef<DeletePopupConfirmComponent>,
    private toastr: ToastrService
  ) {

  }
  
  ngOnInit(): void {
    
  }

  continue() {
    this.dialogRef.close();
  }

  cancelRequest() {
    this.auth.cancelDeleteRequest().subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.dialogRef.close();
          this.toastr.success(res.message);
        } 
        else this.toastr.error(res.message);
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Invalid Mobile Number')
    });
  }

  closeAlert() {
    this.dialogRef.close();
  }

}
