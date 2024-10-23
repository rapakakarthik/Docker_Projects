import { Component, OnInit } from '@angular/core';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  inquiryList: any;
  inquiryDetails: any;
  inquiryOpened: boolean = false;
  rfqOpened: boolean = false;
  dialogRef: any;
  constructor(
    private rfq: RfqService,
    private router: Router,
    private crud: CrudService,
  ) { }
  ngOnInit(): void {
    this.getNotificationList();
  }

  
  collection: any[] = [];
  serverDown: boolean = false;
  noNotificationFound = false;
  totalCount = 0;
  unreadCount = 0;
  getNotificationList() {
    this.noNotificationFound = false;
    this.collection = [];
    let body = {
      limit: 10,
      skip: this.skipItems,
    }
    this.rfq.getNotificationList(body).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.collection = res.data;
          this.totalCount = res.total_count;
          this.unreadCount = res.unread_count;
          if(res.total_count == 0) {
            this.noNotificationFound = true;
          }
        }
        else {
          this.collection = [];
          this.noNotificationFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.serverDown = true;
        console.error(err.message, err.error); 
      }
    });
  }

  openNotify(data: any) {
    if(data.read_status == 0) {
      let id: number = data.id;
      this.crud.updateNotification(id).subscribe({
        next: (value: any) => {
          if(value.status === 200) {
            this.rfq.notificationRead();
            // let parsedData = JSON.parse(data.custom_data);
            if(data.type == "rfq" || data.type == "inquiry") {
              localStorage.setItem('notificationObject', data.custom_data);
              this.router.navigate(['account/viewdetails']);
            }
            else if (data.type == "quotation"){
              let id = JSON.parse(data.custom_data).rfq_id;
              this.router.navigate(['account/rfqdetails', id]);
            }
            // console.log(parsedData);
          }
          else {
            // this.toastr.warning("Something went wrong")
          }
        },
        error: (err: HttpErrorResponse) => {
          // this.toastr.error("Something went wrong")
        }
      })
    } else {
      // let parsedData = JSON.parse(data.custom_data);
      if(data.type == "rfq" || data.type == "inquiry") {
        localStorage.setItem('notificationObject', data.custom_data);
        this.router.navigate(['account/viewdetails']);
      }
      else if (data.type == "quotation"){
        let id = JSON.parse(data.custom_data).rfq_id;
        this.router.navigate(['account/rfqdetails', id]);
      }
      // console.log(parsedData);
    }
  }

  deleteNotification(id: number) {
    this.rfq.deleteNotification(id).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.getNotificationList();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error); 
      }
    });
  }

  markAllAsRead() {
    this.crud.updateNotification(0).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.getNotificationList();
          this.rfq.notificationRead();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error); 
      }
    });
  }

  skipItems: number = 0;
  p: number = 0;
  onPageChange(pageNumber: number) {
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 10;
    this.getNotificationList();
  }

  goTo(rfqId: number) {
    this.router.navigate(['account/rfqdetails', rfqId]);
  }

}
