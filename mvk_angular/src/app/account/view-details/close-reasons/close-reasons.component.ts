import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-close-reasons',
  templateUrl: './close-reasons.component.html',
  styleUrls: ['./close-reasons.component.scss']
})
export class CloseReasonsComponent implements OnInit{
  rfqId: number = 0
  closedReason: string = "";
  rfqCloseReasons: any;
  type: string = ''
  constructor(private rfq: RfqService, 
    public dialogRef: MatDialogRef<CloseReasonsComponent>,  
    @Inject(MAT_DIALOG_DATA) public rfqClose: any,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.rfqCloseReasons = this.rfqClose.reasons
    this.rfqId = this.rfqClose.rfqId;
    this.type = this.rfqClose.type
  }

  deleteRfq() {
    if(this.rfqId) {
      const obj = {
        rfq_id: this.rfqId,
        update_type: "delete",
        flag: "",
        reason: ''
      }
      if(this.closedReason) obj['reason'] = this.closedReason
      if(this.closedReason) obj['update_type'] = "close";
      this.rfq.updateRfq(obj).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.toastr.success(res.message);
            // console.log(res.data)
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
    this.dialogRef.close();
  }
  closeRFQpopup() {
    this.dialogRef.close();
  }
}
