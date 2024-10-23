import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { CloseReasonsComponent } from '../view-details/close-reasons/close-reasons.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { NotesComponent } from './notes/notes.component';
import { QuoteCloseReasonsComponent } from './quote-close-reasons/quote-close-reasons.component';
import { RfqNewComponent } from 'src/app/shared/components/rfq/rfq-new/rfq-new.component';

@Component({
  selector: 'app-rfq-view-details',
  templateUrl: './rfq-view-details.component.html',
  styleUrls: ['./rfq-view-details.component.scss'],
})
export class RfqViewDetailsComponent implements OnInit{
 
  showQuoteDetails: boolean = false;
  dialogRef: any;
  rfqId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private rfq: RfqService,
    ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rfqId = Number(params.get("rfqId"))
      this.compareRfqQuotes(rfqId);
      this.rfqId = rfqId;
    });
  }

  productId = 0;
  showDetails = (id: number) => {
    this.showQuoteDetails = !this.showQuoteDetails;
    this.productId = id;
  };
  
  rfqDetails: any;
  quotations: any[] = [];
  quoteCount: number = 0;
  compareRfqQuotes(rfqId: number): void {
    this.rfq.compareRfqQuotes(rfqId).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.rfqDetails = value.rfq_details;
          this.quotations = value.quotations;
          this.quoteCount = value.total_count;
          this.quoteCloseReasons = value.reasons;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log("rfq quotes error: " + error.message)
      }
    })
  }

  // Mat Dilog section Here

  addDetails() {
    this.openRFQForm("update")
  }
  postAgain() {
    this.openRFQForm("post again")
  }
  
  addNote(quote: any) {
    this.dialogRef = this.dialog.open(NotesComponent, {
      width: '650px',
      disableClose: true,
      data: {quote_id: quote.pk_quote_id, note: quote.note}
   
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.compareRfqQuotes(this.rfqId);
    });
  }

  openRFQForm(type: string) {
    const dataObject = {
      data: this.rfqDetails,
      type: type
    }
    this.dialogRef = this.dialog.open(RfqComponent, {
      width: '800px',
      data: dataObject
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      // this.getRfqList();
    });
  }

  rfqCloseReasons: any;
  closeRfq() {
    this.rfq.getRfqClose().subscribe(res => {
      if(res.status === 200) {
        this.rfqCloseReasons = res.data
        const rfqClose = {
          reasons: this.rfqCloseReasons,
          rfqId: this.rfqId,
          type: this.rfqDetails.status
        }
        this.dialogRef = this.dialog.open(CloseReasonsComponent, {
          width: '650px',
          data: rfqClose
        });
        this.dialogRef.afterClosed().subscribe((_result: any) => {
          this.compareRfqQuotes(this.rfqId);
        });
      }
    })
  }

  quoteCloseReasons: string[] = [];
  closeQuote(id: number) {
    const quoteClose = {
      reasons: this.quoteCloseReasons,
      quoteId: id
    }
    this.dialogRef = this.dialog.open(QuoteCloseReasonsComponent, {
      width: '650px',
      data: quoteClose
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.compareRfqQuotes(this.rfqId);
    });
  }

  getSpanStyle(key: string) {
    return this.rfq.getSpanStyle(key);
  }

  editRfq() {
    this.updateRfq('update');
  }

  postRfqAgain() {
    this.updateRfq('postAgain');
  }

  updateRfq(type: "update" | "postAgain") {
    let data = {
      type: type,
      obj: this.rfqDetails,
      isSignedIn: true
    }
    this.dialogRef = this.dialog.open(RfqNewComponent, {
      width: '1000px',
      data
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      // this.rfqClosed.emit();
    });
  }
}
