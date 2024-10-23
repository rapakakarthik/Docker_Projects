import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { CloseReasonsComponent } from '../close-reasons/close-reasons.component';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { apiObject } from '../../rfq-list/rfq-list.component';
import { RfqNewComponent } from 'src/app/shared/components/rfq/rfq-new/rfq-new.component';

@Component({
  selector: 'app-rfqlist-details',
  templateUrl: './rfqlist-details.component.html',
  styleUrls: ['./rfqlist-details.component.scss'],
  animations: [
    trigger('toggleSection', [
      state('hidden', style({ height: '0', opacity: 0 })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
    ]),
  ],
})
export class RfqlistDetailsComponent implements OnInit{
  rfqId: number = 0
  rfqDetails: any;
  rfqList: any;
  @Input() id!: any;
  @Output() rfqClosed = new EventEmitter()
  
  constructor(
    private crud: CrudService,
    private rfq: RfqService,
    private dialog: MatDialog,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.getRfqDetails(this.id)
  }
  
  getRfqDetails(id: number) {
    this.rfqId = id;
  //  this.rfqOpened = !this.rfqOpened;
    this.rfq.getRfqDetails(this.rfqId).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.rfqDetails = value.data
          // console.log(this.rfqDetails)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('fetch-rfq-details : ' + error.message)
      }
    });

  }

  showMore: boolean = false
  showMoreText: string = 'Show More'
  showMoreDetails() {
    this.showMore = !this.showMore;
    if(this.showMore) this.showMoreText = 'Show Less';
    else this.showMoreText = 'Show More';
  }
  
  // getRfqList() {
  //   let obj: apiObject = {
  //     limit: 10,
  //     skip: 0,
  //     order: 'Desc',
  //     filter: ''
  //   }
  //   this.rfq.getRfqList(obj).subscribe({
  //     next: (value) => {
  //       if (value.status === 200) {
  //         this.rfqList = value.data;
  //       }
  //       if(value.status == 400) {
  //         this.rfqList = [];
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.log("fetch-rfq-list: " + err.message)
  //     }
  //   });
  // }

  // openRFQForm(type: string) {
  //   const dataObject = {
  //     data: this.rfqDetails,
  //     type: type
  //   }
  //   this.dialogRef = this.dialog.open(RfqComponent, {
  //     width: '800px',
  //     data: dataObject
   
  //   });
  //   this.dialogRef.afterClosed().subscribe((_result: any) => {
  //     this.getRfqList();
  //   });
  // }

  rfqCloseReasons: any;
  closeRfq(status: string) {
    this.rfq.getRfqClose().subscribe(res => {
      if(res.status === 200) {
        this.rfqCloseReasons = res.data
        const rfqClose = {
          reasons: this.rfqCloseReasons,
          rfqId: this.rfqId,
          type: status.toLowerCase()
        }
        this.dialogRef = this.dialog.open(CloseReasonsComponent, {
          width: '650px',
          data: rfqClose
        });
        this.dialogRef.afterClosed().subscribe((_result: any) => {
          this.rfqClosed.emit();
          // this.getRfqList();
        });
      }
    })
  }
  
  addDetails() {
    // this.openRFQForm("update")
  }
  postAgain() {
    // this.openRFQForm("post again")
  }

  toggleRfqProfile(id: number = 0) {
    // this.rfqOpened = !this.rfqOpened;
  }

  goTo(id: number) {
    this.router.navigate(['/account/rfqdetails/' + id])
  }

  getSpanStyle(key: string) {
    return this.rfq.getSpanStyle(key);
  }

  // new rfq code
  editRfq() {
    this.updateRfq('update');
  }

  postRfqAgain() {
    this.updateRfq('postAgain');
  }

  dialogRef: any;
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
      this.rfqClosed.emit();
    });
  }

}
