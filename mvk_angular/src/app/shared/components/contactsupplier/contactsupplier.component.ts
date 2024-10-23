import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { AuthGuard } from '../../services/auth.guard';
import { EmailPopupComponent } from '../email-popup/email-popup.component';
import { EnquiryNewComponent } from '../enquiry-new/enquiry-new.component';

@Component({
  selector: 'app-contactsupplier',
  templateUrl: './contactsupplier.component.html',
  styleUrls: ['./contactsupplier.component.scss']
})
export class ContactsupplierComponent implements OnInit {
  dialogRef: any;
  ngOnInit(): void { 
    // if(this.productName) {
    //   this.sellerDetails['productName'] = this.productName;
    // }
  }
  constructor(private authguard: AuthGuard, private dialog: MatDialog) { }
  @Input() btnstyle: boolean = false;
  @Input() companyBtn: boolean = false;
  @Input() class!: string;
  @Input() sellerDetails: any;
  @Input() productName!: string;
  @Input() disabled: boolean = false;


  // clickEvent() {
  //   if (localStorage.getItem('token')) {
  //     this.openEnquiryForm();
  //   } else {
  //     this.authguard.openDialog();
  //   }
  // }

  openEnquiryForm() {
    this.dialogRef = this.dialog.open(EnquiryNewComponent, {
      width: '700px',
      data: this.sellerDetails
    });

    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed');
    });
  }

  userObj: any;
  userEmail: string = '';
  showInquiry() {
    if (localStorage.getItem('token') && localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userEmail = this.userObj.email
      if(this.userEmail) {
        this.openEnquiryForm();
      }else {
        this.dialogRef = this.dialog.open(EmailPopupComponent, {
          width: '500px'
        });
        this.dialogRef.afterClosed().subscribe((_result: any) => {
          // this.location.replaceState(this.previousUrl);
        });
      }
    } else {
      this.authguard.openDialog();
    }
  }


}
