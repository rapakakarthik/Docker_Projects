import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RfqService } from '../../services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthGuard } from '../../services/auth.guard';

@Component({
  selector: 'app-view-number',
  templateUrl: './view-number.component.html',
  styleUrls: ['./view-number.component.scss']
})
export class ViewNumberComponent implements OnInit {


  @ViewChild('thankyoutemplate')
  thankyoutemplate!: TemplateRef<any>;

  @Input() class!: string;
  @Input() btnstyle: boolean = false;
  @Input() cid?: any
  @Input() disabled: boolean = false;
  @Input() type: string = "";
  thankyouDialogRef: any;
  message: string = '';
  buyerSellerStatus: boolean = false;
  constructor(private authguard: AuthGuard, private service: RfqService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.btnstyle = true;
    }
  }

  showcall() {
    if (localStorage.getItem('token')) {
      this.btnstyle = true;
    }
    else {
      this.authguard.openDialog();
    }
  }

  callLoader = false;
  getCalls() {
    if(this.disabled) return;
    this.callLoader = true;
    this.service.getCalls(this.cid).subscribe(res => {
      this.callLoader = false;
      if (res.status === 200) {
        this.message = res.message;
        this.openConfirmation();
      }
    })
  }


  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '350px',
      disableClose: true
    });
    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
    });



    setTimeout(() => {
      this.thankyouDialogRef.close()
    }, 6000);
  }

}
