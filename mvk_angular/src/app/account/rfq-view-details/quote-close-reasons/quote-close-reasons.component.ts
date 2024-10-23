import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-quote-close-reasons',
  templateUrl: './quote-close-reasons.component.html',
  styleUrl: './quote-close-reasons.component.scss'
})
export class QuoteCloseReasonsComponent implements OnInit{
  quoteId: number = 0
  closedReason: string = "";
  quoteCloseReasons: any;
  constructor(private rfq: RfqService, 
    public dialogRef: MatDialogRef<QuoteCloseReasonsComponent>,  
    @Inject(MAT_DIALOG_DATA) public quoteClose: any,
    private toastr: ToastrService
  ) {
  }
  ngOnInit(): void {
    this.quoteCloseReasons = this.quoteClose.reasons
    this.quoteId = this.quoteClose.quoteId;
  }

  deleteQuote() {
    if(this.quoteId) {
      this.rfq.deleteRfqQuote(this.quoteId, this.closedReason).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.toastr.success(res.message);
            this.dialogRef.close();
          }
          if(res.status == 400) {
            this.toastr.warning(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.message);
          console.error('rfq delete error', err.message);
        }
      })
    }
  }
  closeQuotePopup() {
    this.dialogRef.close();
  }
}

