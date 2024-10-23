import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss']
})
export class RfqListComponent implements OnInit, OnDestroy {
  inquiryList: any;
  inquiryDetails: any;
  inquiryOpened: boolean = false;
  rfqOpened: boolean = false;
  dialogRef: any;

  @Input('getOnlyQuotes') getOnlyQuotes = false;
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
    this.openNotification()
    this.getRfqList(0);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('notificationObject');
  }
  
  openNotification() {
    let obj = localStorage.getItem('notificationObject');
    if(obj != null) {
      // console.log(obj);
      let parsedobj = JSON.parse(obj);
      if (parsedobj.message_type == "RFQ") {
        this.handleClick(parsedobj.rfq_id)
      } else {
        
      }
    }
  }

  form!: FormGroup;
  createForm() {
    this.form = this.fb.group({
      sortBy: ['Desc'],
      filter: [''],
      search: [''],
      new_quote: ['']
    });
  }

  get sortStatus() {
    return this.form.get('sortBy');
  }

  get filter() {
    return this.form.get('filter');
  }

  get Search() {
    return this.form.get('search');
  }
  
  rfqList: any[] = [];
  serverDown: boolean = false;
  noRfqFound = false;
  totalCount: number = 0;
  skip = 0;
  getRfqList(skip: number) {
    this.noRfqFound = false;
    let obj = {
      limit: 5,
      skip: skip,
      order: this.sortStatus?.value,
      filter: this.filter?.value,
      search: this.Search?.value,
      quotes: this.getOnlyQuotes,
      new_quote: this.new_quote
    }
    this.rfq.getRfqList(obj).subscribe({
      next: (res) => {
        this.serverDown = false;
        if (res.status === 200) {
          this.rfqList = res.rfq;
          // console.log(this.rfqList);
          this.totalCount = res.count;
          if(this.rfqList.length == 0) {
            this.noRfqFound = true;
          }
        }
        else {
          this.rfqList = [];
          this.noRfqFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.rfqList = [];
        this.serverDown = true;
        console.error(err.message, err.error); 
      }
    });
  }

  approve = (id: number, status: 'approved' | 'rejected') => {
    let obj = {
      rfq_id: id,
      update_type: 'buyer_status',
      flag: status,
    }
    this.rfq.updateRfq(obj).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.getRfqList(0);
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
  

  rfqDetails: any;
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
      this.getRfqList(this.skip);
    });
  }

  onSubmit() {
    const selectedValue = this.sortStatus;
    console.log('Selected value: ', selectedValue);
    // You can perform actions with the selected value here
  }

  rfqCloseReasons: any;
  rfqId: number = 0
  handleClick(id: number) {
    this.rfqId = id;
    this.showrfqDetails = true;
  }

  showrfqDetails: boolean = false;
  toggleRfqProfile() {
    this.showrfqDetails = false;
  }

  rfqClosed() {
    this.showrfqDetails = false;
    this.getRfqList(this.skip);
  }

  goTo(rfqId: number) {
    this.router.navigate(['account/rfqdetails', rfqId]);
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
          this.getRfqList(this.skip);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }

  p: number = 1;
  onPageChange(pageNumber: number) {
    this.p = pageNumber;
    this.skip = (pageNumber - 1) * 5;
    this.getRfqList(this.skip);
    window.scrollTo(0, 0);
  }

  getSpanStyle(key: string) {
    let styles: { [key: string]: string } = {};
    switch (key.toLowerCase()) {
      case 'open':
        styles['border-color'] = '#02A8DF';
        styles['color'] = '#02A8DF';
        break;
      case 'onhold':
        styles['color'] = '#ffd233';
        styles['background-color'] = '#fdfaee';
        break;
        case 'approved':
          styles['color'] = '#3fa950';
          styles['background-color'] = '#ecf6ee';
        break;
        case 'rejected':
          styles['color'] = '#d63333';
          styles['background-color'] = '#fce6e6';
        break;
      default:
        styles['color'] = 'black';
        break;
    }
    return styles;
  }

  goToRfqQuote() {
    this.router.navigateByUrl("/rfq-quote")
  }

  filters = [
    {id: "", value: "All"},
    {id: "status_approved", value: "Approved"},
    {id: "status_open", value: "Open/Pending"},
    {id: "status_rejected", value: "Rejected"},
    {id: "status_onhold", value: "On Hold"},
    {id: "status_closed", value: "Closed"},
  ]

  new_quote = false;
  getQuote() {
    let fd = this.form.value;
    this.new_quote = fd.new_quote;
    this.getRfqList(0);
  }

}

export interface apiObject{
  limit: number,
  skip: number,
  order: string,
  filter: string
}

