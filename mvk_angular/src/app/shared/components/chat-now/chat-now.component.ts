import { Component, Input, OnInit } from '@angular/core';
import { ChatService, SellerDetailsChat } from 'src/app/shared/services/chat.service';
import { AuthGuard } from '../../services/auth.guard';
import { MatDialog } from '@angular/material/dialog';
import { EmailPopupComponent } from '../email-popup/email-popup.component';

@Component({
  selector: 'app-chat-now',
  templateUrl: './chat-now.component.html',
  styleUrls: ['./chat-now.component.scss']
})
export class ChatNowComponent implements OnInit {

  @Input() sellerDetails!: any;
  @Input() det!: any;
  @Input() class!: string;
  @Input() btnstyle: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: string = "";
  // @Input() labelTxt!: any;

  showingChat: boolean = false
  maximizeChat: boolean = true;
  buyerSellerStatus: boolean = false;
  sampleDetails: any;

  constructor(private authguard: AuthGuard, private chatService: ChatService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log(this.sellerDetails);
    // console.log(this.det);
    if (localStorage.getItem('token')) {
      this.setSellerDetails();
    }
  }

  setSellerDetails() {
    if (!this.sellerDetails) {
      this.sellerDetails = {
        sellerAccountId: this.det?.company_id, //company Id
        sellerId: this.det?.seller_id || this.det?.fk_seller_id, //person or individual id
        companyName: this.det?.seller_company_name ?? this.det.company_name,
        companyLogo: this.det?.company_logo,
        // buyerSellerStatus: this.det?.buyerSellerStatus
      }
      this.buyerSellerStatus = (this.det?.buyerSellerStatus || this.det?.buyer_seller_status) == 1
    } else {
      this.buyerSellerStatus = this.sellerDetails.buyerSellerStatus == 1
    }
  }

  userObj: any;
  userEmail: string = '';
  dialogRef: any;
  showChat() {
    if (localStorage.getItem('token')) {
      if(localStorage.getItem('userObj')) {
        this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
        this.userEmail = this.userObj.email
        if(this.userEmail != '') {
          let seller_detais: SellerDetailsChat = {
            sellerId: this.sellerDetails.sellerId,
            sellerAccountId: this.sellerDetails.sellerAccountId,
            companyName: this.sellerDetails.companyName,
            companyLogo: this.sellerDetails.companyLogo
          }
          this.chatService.setCallChatWrap(seller_detais)
        }else {
          this.dialogRef = this.dialog.open(EmailPopupComponent, {
            width: '500px'
          });
          this.dialogRef.afterClosed().subscribe((_result: any) => {
            // this.location.replaceState(this.previousUrl);
          });
        }
      }
    } else {
      this.authguard.openDialog();
    }
  }
}
