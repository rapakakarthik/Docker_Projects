import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-signin-card',
  templateUrl: './signin-card.component.html',
  styleUrls: ['./signin-card.component.scss']
})
export class SigninCardComponent implements OnInit {

  islogin: boolean = false;
  userObj: any;
  mobile: any = '';
  name: any = '';
  displayName: any = '';
  profile = "";

  assigneeInfo: any;
  // @Input() userObj: any;

  constructor(private crud: CrudService, private toastr: ToastrService, private router: Router, private dialog: MatDialog) {}
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.islogin = true;
      if (localStorage.getItem('userObj')) {
        this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}')
        this.getFavCount(this.userObj.buyerId);
        this.getProductHistory();
      }
      this.mobile = this.userObj.mobile;
      this.name = this.userObj.name;
      this.profile = this.userObj.avatar;
      this.assigneeInfo = this.userObj.assignee;
      if (this.name != '' && this.name != null) {
        this.displayName = this.name
      }
      else {
        this.displayName = this.mobile
      }


    }
    else {
      this.islogin = false
    }

  }

  favCount: number = 0;
  favSuppliers: number = 0;
  getFavCount(buyer_id: number) {
    this.crud.getFavCount(buyer_id).subscribe({
      next: (value: any) => {
        this.favCount = value.data?.saved_products;
        this.favSuppliers = value.data?.saved_suppier;
      },
      error: (err: HttpErrorResponse) => {
        this.favCount = 0;
        // this.toastr.error(err.message);
        console.log(err.error);
      }
    })
  }


  goTo(name: string, id: number) {
    if(id) {
      let url = name + "-" + id;
      this.router.navigate(['product', url]);
    }
  }

  navTo(nav: string) {
    this.router.navigate([nav])
  }

  message: string = 'Call Initiated Succesfully';
  inProgress = false;
  contactMsg = "Contact Now";
  call() {
    this.inProgress = true;
    this.contactMsg = "Call in progress.."
    this.openConfirmation();
    let number1 = this.mobile;
    let number2 = this.assigneeInfo.assist_user_number;
    this.crud.call(number1, number2).subscribe({
      next: (value: any) => {
        this.inProgress = false;
        this.contactMsg = "Contact Now"
        if(value.status == 200) {
          // this.message = value.message;
          // this.thankyouDialogRef.close();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.inProgress = false;
        this.contactMsg = "Contact Now"
        console.log(err.error);
      }
    })
  }

  thankyouDialogRef: any;
  @ViewChild('thankyoutemplate')
  thankyoutemplate!: TemplateRef<any>;
  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '350px',
      disableClose: true
    });
    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
    });
    setTimeout(() => {
      this.thankyouDialogRef.close();
    }, 6000);
  }

  historyProducts: any[] = [];
  getProductHistory() {
    this.historyProducts = [];
    let userId = parseInt(this.userObj.buyerId);
    this.crud.getProductHistory(userId).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.historyProducts = value.data
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    })
  }



}
