import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    private crud: CrudService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getNotificationHistory();
  }

  notificationData: any;
  noDataFound = false;
  getNotificationHistory() {
    this.noDataFound = false;
    const obj = {
      limit: 10,
      search: ''
    }
    this.crud.getNotificationHistory(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.notificationData =  value.data;
          if(value.total_count == 0) {
            this.noDataFound = true;
          }
        }
        else {
          this.noDataFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.noDataFound = true;
      }
    })
  }

  openNotify(data: any) {
    if(data.read_status == 0) {
      let id: number = data.id;
      this.crud.updateNotification(id).subscribe({
        next: (value: any) => {
          if(value.status === 200) {
            // let parsedData = JSON.parse(data.custom_data);
            if(data.type == "rfq" || data.type == "inquiry" || data.type == "quotation") {
              localStorage.setItem('notificationObject', data.custom_data);
              this.router.navigate(['account/viewdetails']);
              this.closeDialog();
            }
            // console.log(parsedData);
          }
          else {
            // this.toastr.warning("Something went wrong")
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error("Something went wrong")
        }
      })
    } else {
      // let parsedData = JSON.parse(data.custom_data);
      if(data.type == "rfq" || data.type == "inquiry" || data.type == "quotation") {
        localStorage.setItem('notificationObject', data.custom_data);
        this.router.navigate(['account/viewdetails']);
        this.closeDialog();
      }
      // console.log(parsedData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
