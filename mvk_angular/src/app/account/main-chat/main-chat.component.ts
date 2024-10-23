import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, finalize, map } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { EmailPopupComponent } from 'src/app/shared/components/email-popup/email-popup.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { L } from '@angular/cdk/keycodes';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';


@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {

  private auth = inject(AuthenticationService);
  
  chatName: string = '';
  getcompanyId:string='';
  companyDetails: any;
  searchKeyword!: string;
  filteredList: any[] = [];
  viewmore: boolean = false;

  //Upload Image
  selectedFile: File | null = null;
  downloadURL: string | null = null;

  message!: string;

  closeRight: boolean = false;
  // setActiveName(id: number) {
  //   this.activeName = id;
  // }

  //User Details
  userObj: any;
  buyerId: number = 0;
  buyerName: string = '';
  institueName: string = '';
  profilePhoto: string = '';

  //Seller Details
  sellerDetails = {
    sellerAccountId: 0,
    sellerId: 0,
    companyName: '',
    companyLogo: '',
  };

  showingChat: boolean = false;
  maximizeChat: boolean = true;

  sampleDetails: any;
  sellerList: any[] = [];
  relPath: any;

  messages: any[] = [];
  imageUrls$!: Observable<any[]>;

  smilemessage=""
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'twitter';
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    console.log(this.smilemessage)
    const { smilemessage } = this;
    console.log(smilemessage);
    console.log(`${event.emoji.native}`)
    const text = `${smilemessage}${event.emoji.native}`;

    this.smilemessage = text;
    this.message = text;
    // this.showEmojiPicker = false;
  }

  @ViewChild('listContainer', { static: false }) listContainer!: ElementRef;
 
  constructor(
    private chatService: ChatService,
    private crud: CrudService,
    private db1: AngularFireDatabase, 
    private dialog: MatDialog,
    private router: Router,
    private rfq: RfqService
  ) {}

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.changeActivestatus(false);
  }

  ngOnInit(): void {
    this.openMainChat();
    // this.tryMethod()
    // this.setUserDetails();
    // this.getSellerList();
    // this.getImageUrls()
  }

  userObj2: any;
  userEmail: string = '';
  dialogRef: any;
  openMainChat() {
    if (localStorage.getItem('userObj')) {
      this.userObj2 = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userEmail = this.userObj2.email
      if(this.userEmail) {
        this.setUserDetails();
        this.getChatList();
        // this.getSellerList();
      } else {
        this.popupEmail();
      }
    } else {
      this.router.navigate(['/signin'])
    }
  }

  popupEmail() {
    this.dialogRef = this.dialog.open(EmailPopupComponent, {
      width: '500px'
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.router.navigate(['/account/profile'])
    });
  }


  tryMethod(): void {
    // this.chatService.signInWithEmailAndPassword('prahlad@myverkope.com', '9700972319')
  }

  resetPwd(): void {
    // this.chatService.resetPassword('email');
  }

  getCompanyDetails(id: number) {
    this.crud.getCompanyDetails(id, 'profile', '', 'all_products').subscribe((res) => {
      this.companyDetails = res.data;
    });
  }

  getUnread() {
    this.filteredList = this.filteredList.filter(res => res.newMsgCount > 0)
  }

  getAll() {
    this.filteredList = this.chatList;
  }

  getSellerList() {
    this.chatService.getSellerList(this.buyerId).subscribe((res) => {
      this.sellerList = res;
      this.filteredList = this.sellerList;
    });
  }

  //Setting Buyer Details
  setUserDetails() {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }
    this.buyerId = this.userObj.buyerId;
    this.buyerName = this.userObj.name;
    this.institueName = this.userObj.institueName;
    this.profilePhoto = this.userObj.avatar;
  }

  //Selecting Image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFile) {
      const obj = {
        details: {},
        deviceId: '',
        device_type: 2,
        filePath: '',
        from: 'Buyer_' + this.buyerId.toString(),
        message: '',
        messageId: '',
        seen: false,
        seenTime: 0,
        time: new Date().getTime(),
        to: 'Seller_' + this.sellerDetails.sellerId.toString(),
        type: 'image',
      };
      this.chatService.uploadImage(
        this.selectedFile,
        obj,
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      );
    }
  }

  /*
    imageMessageStorageRef =
    FirebaseStorage.getInstance().reference.child("ChatModule" + RetrofitBuilder.API_TYPE)
      .child("MessageImages").child(sellerCompanyFbId + "_" + sellerUserId)
      .child(buyerCompanyFbId + "_" + buyerUserId)
    docMessageStorageRef =
    FirebaseStorage.getInstance().reference.child("ChatModule" + RetrofitBuilder.API_TYPE)
      .child("MessageFiles").child(sellerCompanyFbId + "_" + sellerUserId)
      .child(buyerCompanyFbId + "_" + buyerUserId)

    ChatModuleLive/MessageImages/Seller_10707_722/Buyer_370_370/buyer_-NGV4lxE7WLnyK97hYxx.jpg
  */

  getImageUrls() {
    const imagesRef = this.db1.list('SeeUploads23/Uploads');
    this.imageUrls$ = imagesRef.valueChanges();
    this.imageUrls$.subscribe((res) => {});
  }

  saveDownloadURLToDatabase(downloadURL: string) {
    // Save the download URL to the Realtime Database
    this.db1.list('SeeUploads23/Uploads').push({ downloadURL });
  }

  updateData(event?: Event) {
    const Event = event as KeyboardEvent;
    this.smilemessage = ''
    this.showEmojiPicker = false;
    this.sendMessage();
    this.sendBuyerDetails();  
    this.sendBuyerSellers();
    this.sendSellerBuyers();
    this.sendSellerDetails();
    Event.preventDefault();
  }

  //Create Buyer Details
  sendBuyerDetails() {
    const obj = {
      activeNow: true,
      activeTime: new Date().getTime(),
      companyId: this.buyerId.toString(), //buyer_user_id
      companyName: this.institueName, //school name
      createAt: new Date().getTime(), //current time
      fcmRegToken: null, //fire base token
      profilePhoto: this.profilePhoto, //photo url
      userId: this.buyerId.toString(), //user_id
      userName: this.buyerName, //user name
      userType: 2, //
    };
    if (this.buyerId != 0 ) {
      this.chatService.createBuyerDetails(obj, this.buyerId).then(() => {
        console.log('Buyer Details updated succesfully');
      });
    } else {
      console.log('Check Buyer Id');
    }
  }

  pushNotification(type: string, time: number) {

    const jsonObject = {
      buyer_company_id: this.buyerId.toString(),
      buyer_user_id: this.buyerId.toString(),
      buyer_company_name: this.institueName,
      buyer_user_name: this.buyerName,
      buyer_profile_pic: this.profilePhoto,
      message: this.message,
      message_time: time.toString(),
      message_type: type // text,image,enquiry,rfq
    }
    
    const obj = {
      from_id: this.buyerId.toString(),
      to_id: this.sellerDetails.sellerId.toString(),
      title: this.buyerName,
      message: this.message,
      type: 'text',
      // image: '', //Image path
      customData: JSON.stringify(jsonObject),
      from_type:  "buyer",
      to_type: "seller",
      channelId: "MvkChat"

    }
    // console.log(obj);
    let chatListReq = {
      company_id: obj.to_id,
      user_id: obj.from_id,
      last_message: obj.message,
      last_message_type: obj.type,
    }
    this.auth.updateChatList(chatListReq).subscribe({
      next: (result: any) => {
        if(result.status === 200) {
          console.log(result);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('update chatlist error', err.message);
      }
    })
    this.chatService.pushNotification(obj).subscribe({
      next: (result: any) => {
        if(result.status === 200) {
          console.log(result);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('push notification error', err.message);
      }
    })
  }

  // Create a new message
  sendMessage() {
    this.getLastActiveTime();
    const obj = {
      details: "",
      deviceId: '',
      device_type: '2',
      filePath: '',
      from: 'Buyer_' + this.buyerId.toString(),
      message: this.message,
      // messageId: '',
      seen: false,
      seenTime: 0,
      time: new Date().getTime(),
      to: 'Seller_' + this.sellerDetails.sellerId.toString(),
      type: 'text',
    };
    this.chatService
      .createMessage(
        obj,
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .then(() => {
        this.pushNotification(obj.type, obj.time);
        let chatListObj = {
          company_id: this.sellerDetails.sellerId.toString(),
          user_id: this.buyerId.toString()
        }
        this.chatService.updateChatlistApi(chatListObj);
        this.message = '';
        console.log('msg sent successfully');
      })
      .catch((error: any) => {
        console.error('Error creating node:', error);
      });
    this.chatService
      .getMessages(
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .subscribe((messages) => {
        this.scrollToLastItem();
        this.messages = messages;
        this.inquiryDetails = messages.map((message: any) => {
          if(message.details) {
            return JSON.parse(message.details);
          }
          else return {}
        })
      });
  }

  sendMessageAsSeller() {
    const obj = {
      details: "",
      deviceId: '',
      device_type: '2',
      filePath: '',
      from: 'Seller_' + this.sellerDetails.sellerId.toString(),
      message: `Thank you for contacting Us, ${this.buyerName}. Please let us know how we can help you.`,
      messageId: '',
      seen: false,
      seenTime: 0,
      time: new Date().getTime(),
      to: 'Buyer_' + this.buyerId.toString(),
      type: 'text',
    };
    this.chatService
      .createMessage(
        obj,
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .then(() => {
        this.message = '';
        console.log('auto reply msg sent successfully');
      });
    this.chatService.getMessages(
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId)
      .subscribe((messages) => {
        if(messages) {
          console.log("messages recieved successfully")
          this.messages = messages;
          this.inquiryDetails = messages.map((message: any) => {
            if(message.details) {
              return JSON.parse(message.details);
            }
            else return {}
          })
        }
      });
  }

  getLastActiveTime() {
    this.chatService.getMessages(
      this.sellerDetails.sellerAccountId,
      this.sellerDetails.sellerId,
      this.buyerId)
    .subscribe((messages) => {
      if(messages) {
        if(messages.length === 0) {
          this.sendMessageAsSeller();
          console.log('msg sent for first time');
        } else {
          const lastActiveTime =  ([...messages].pop().time as number);
          console.log("messages recieved before send message successfully");
          const currentTime = Date.now();
          const timeDiff =  currentTime - lastActiveTime;
          const lastActiveTimeInMin = timeDiff / (1000 * 60)
          console.log('last active time', lastActiveTimeInMin);
          if(lastActiveTimeInMin >= 60) {
            this.sendMessageAsSeller();
            console.log('msg sent by check time')
          } 
          
        }
      }
    });
  }

  sendBuyerSellers() {
    const obj = {
      companyId: this.sellerDetails.sellerAccountId.toString(),
      companyLogo: this.sellerDetails.companyLogo,
      companyName: this.sellerDetails.companyName,
      lastMessage: this.message,
      lastMsgTime: new Date().getTime(),
      msgType: 'text',
      newMsgCount: 0,
      userId: this.sellerDetails.sellerId.toString(),
      userName: this.sellerDetails.companyName,
      buyer_seller_status: 0
    };
    if (this.buyerId != 0) {
      this.chatService
        .createBuyerSellers(
          obj,
          this.buyerId,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('Buyer Sellers list updated succesfully');
        });
    } else {
      console.log('Check seller ID');
    }
  }

  sendSellerBuyers() {
    const obj = {
      chatRequest: "0",
      companyId: this.buyerId.toString(),
      companyName: this.userObj.institueName, //buyer company
      lastMessage: this.message,
      lastMsgTime: new Date().getTime(),
      msgType: 'text',
      newMsgCount: 1,
      profilePhoto: this.profilePhoto,
      userId: this.buyerId.toString(), //buyer id
      userName: this.buyerName,
      buyer_seller_status: 0
    };
    if (this.buyerId != 0) {
      this.chatService
        .createSellerBuyers(
          obj,
          this.buyerId,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('Seller Buyers List updated succesfully');
        });
    } else {
      console.log('Check seller ID');
    }
  }

  sendSellerDetails() {
    const obj = {
      activeNow: false,
      activeTime: 0,
      companyId: this.sellerDetails.sellerAccountId.toString(), //seller company
      comanyLogo: this.sellerDetails.companyLogo,
      companyName: this.sellerDetails.companyName, //seller company name
      createAt: new Date().getTime(),
      createdBy: this.buyerId.toString(), //buyer id
      fcmRegToken: null,
      userId: this.sellerDetails.sellerId.toString(), //seller user
      userName: this.sellerDetails.companyName,
      userType: 0,
    };
    if (this.sellerDetails.sellerId != 0) {
      this.chatService
        .createSellerDetails(
          obj,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('Seller Details updated succesfully');
        });
    } else {
      console.log('Check seller ID');
    }
  }

  sellerProfileImage =  '';
  getMessagesFromSeller(details: any) {
    this.activeId = details.userId;
    this.sellerDetails['sellerAccountId'] = details.companyId;
    this.sellerDetails['sellerId'] = details.userId;
    this.sellerDetails.companyName = details.companyName;
    this.sellerDetails.companyLogo = details.companyLogo;
    this.sellerProfileImage = details.companyLogo;
    this.chatName = details.companyName;
    this.getcompanyId = details.companyId
    this.getActiveStatus(details.companyId, details.userId)
    this.chatService
      .getMessages1(details.companyId, details.userId, this.buyerId)
      .subscribe((messages) => {
        this.messages = messages;
        this.inquiryDetails = messages.map((message: any) => {
          if(message.details) {
            return JSON.parse(message.details);
          }
          else return {}
        })
        this.changeActivestatus(true);
        setTimeout(() => {
          this.scrollToLastItem();
        });
      });
    this.getCompanyDetails(details.companyId);
  }

  activeId: number | null = null;
  inquiryDetails: any;
  getMessagesFromSellerV2(details: any) {
    this.activeId = details.seller_id;
    this.sellerDetails['sellerAccountId'] = details.company_id;
    this.sellerDetails['sellerId'] = details.seller_id;
    this.sellerDetails.companyName = details.company_name;
    this.sellerDetails.companyLogo = details.company_image;
    this.sellerProfileImage = details.company_image;
    this.chatName = details.company_name;
    this.getcompanyId = details.company_id
    this.getActiveStatus(details.company_id, details.seller_id)
    this.chatService
      .getMessages1(details.company_id, details.seller_id, this.buyerId)
      .subscribe((messages) => {
        this.messages = messages.map((message: any) => {
          const newMessage = { ...message };
          if(message.details && !(typeof message.details == 'object')) {
            newMessage.details =  JSON.parse(message.details);
          }
          return newMessage;
        })
        this.changeActivestatus(true);
        setTimeout(() => {
          this.scrollToLastItem();
        });
      });
    this.getCompanyDetails(details.seller_id);
  }

  activeStatus: boolean = false;
  activeMessage: string = '';
  getActiveStatus(cid: number, uid: number) {
    this.chatService.getActiveStatus(cid, uid).subscribe(res => {
      this.activeStatus = res.activeNow;
      const currentDate = new Date();
      const lastSeenDate = new Date(res.activeTime);
      const timeDiffInSeconds = Math.floor((currentDate.getTime() - lastSeenDate.getTime()) / 1000);
      const thresholdInSeconds = 24 * 60 * 60 * 3;
      if (timeDiffInSeconds <= thresholdInSeconds) {
        const hours = lastSeenDate.getHours();
        const minutes = lastSeenDate.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const dateString = lastSeenDate.toDateString()
        this.activeMessage =  timeString + " " + dateString;
      } else {
        this.activeMessage =  "long time ago";
      }
    })
  }

  changeActivestatus(status: boolean) {
    const buyerId = this.buyerId;
    const activeStatus = status;
    const time = new Date().getTime();
    this.chatService.updateBuyerDetails(buyerId, activeStatus, time).then(() => {
      console.log('Updated active now status');
    });
  }

  closeProfile() {
    this.viewmore = !this.viewmore;
    // this.closeRight = false;
  }
  openProfile() {
    this.closeRight = !this.closeRight;
  }

  filterChat() {
    if (this.searchKeyword.length >= 3) {
      this.filteredList = this.chatList.filter((name) => {
        return (name.userName as string)
          .toLowerCase()
          .includes(this.searchKeyword.toLowerCase());
      });
    } else {
      this.filteredList = this.chatList;
    }
  }

  scrollToLastItem(): void {
    const containerElement = this.listContainer.nativeElement;
    containerElement.scrollTop = containerElement.scrollHeight;
  }

  chatList: any[] = [];
  noChatsFound = false;
  getChatList() {
    this.noChatsFound = false;
    this.crud.getChatList().subscribe({
      next: (res: any) => {
        if(res.status == 200) {
          this.chatList = res.data;
          if(this.chatList.length <= 0) {
            this.noChatsFound = true;
          }
        } else {
          this.noChatsFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.noChatsFound = true;
      }
    })
  }

  openNotify(data: any) {
    if(data.type == "inquiry") {
      localStorage.setItem('notificationObject', JSON.stringify({enquery_id: data.details.inquiry_id, message_type: 'Enquiry'}));
      this.router.navigate(['account/viewdetails']);
    }
    else if (data.type == "quotation"){
      let id = JSON.parse(data.details).rfq_id;
      this.router.navigate(['account/rfqdetails', id]);
    }
  }

  showQuotes = false;
  quoteDet: any;
  getQuoteDetails(id: number) {
    this.rfq.getQuoteDetails(id).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.quoteDet = value.data;
          this.showQuotes = true;
          this.closeRight = true;
        }
      },
      error: (err) => {
        
      },
    })
  }

  openInquiryDetails(id: number) {
    let data = {
      message_type: "Enquiry",
      enquery_id: id
    }
    localStorage.setItem('notificationObject', JSON.stringify(data));
    this.router.navigate(['account/viewdetails']);
  }
}
