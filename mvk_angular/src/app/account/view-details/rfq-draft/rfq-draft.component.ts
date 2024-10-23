import { Component, OnInit } from '@angular/core';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rfq-draft',
  templateUrl: './rfq-draft.component.html',
  styleUrls: ['./rfq-draft.component.scss']
})
export class RfqDraftComponent implements OnInit {
  inquiryList: any;
  inquiryDetails: any;
  inquiryOpened: boolean = false;
  rfqOpened: boolean = false;
  dialogRef: any;
  constructor(
    private rfq: RfqService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { 
    this.createForm();
  }
  ngOnInit(): void {
    this.getRfqDraftList();
  }

  form!: FormGroup;
  createForm() {
    this.form = this.fb.group({
      sortBy: ['Asc'],
    });
  }


  get sortStatus() {
    return this.form.get('sortBy');
  }
  
  rfqDratList: any[] = [];
  serverDown: boolean = false;
  noRfqFound = false;
  getRfqDraftList() {
    let obj = {
      limit: 10,
      skip: 0,
      order: this.sortStatus?.value,
    }
    this.rfq.getRfqDraftList(obj).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.rfqDratList = res.data;
          if(this.rfqDratList.length == 0) {
            this.noRfqFound = true;
          }
        }
        else {
          this.rfqDratList = [];
          this.noRfqFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          this.serverDown = true;
        }
        console.error(err.message, err.error); 
      }
    });
  }

  approve = (id: number) => {
    let obj = {
      rfq_id: id,
      update_type: 'buyer_status',
      flag: 'approved',
    }
    this.rfq.updateRfq(obj).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.getRfqDraftList();
          this.toastr.success(res.message);
        }
        else {
          this.toastr.warning(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.serverDown = true;
        this.toastr.error("Server Unreachable");
        console.error(err.message, err.error); 
      }
    });
  }
  

  // rfqDetails: any;
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
  //     this.getRfqDraftList();
  //   });
  // }

  rfqCloseReasons: any;
  rfqId: number = 0
  handleClick(id: number) {
    this.showrfqDetails = true;
    this.rfqId = id;
  }

  showrfqDetails: boolean = false;
  toggleRfqProfile() {
    this.showrfqDetails = false;
  }

  rfqClosed() {
    this.showrfqDetails = false;
    this.getRfqDraftList();
  }

  goTo(rfqId: number) {
    this.router.navigate(['account/rfqdetails', rfqId]);
  }

  getSpanStyle(key: string) {
    return this.rfq.getSpanStyle(key);
  }

  addToFav(id: number, flag: number) {
    const obj = {
      update_type : "favourite",
      flag: flag == 1 ? 0 : 1,
      rfq_id: id
    }
    this.rfq.updateRfq(obj).subscribe({
      next: (value) => {
        if(value.status === 200) {
          this.toastr.success(value.message);
          this.getRfqDraftList();
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }
}


