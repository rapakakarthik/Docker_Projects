import { Component, ElementRef, OnChanges, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService, SellerDetailsChat } from 'src/app/shared/services/chat.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subscription} from 'rxjs';
import { AuthGuard } from '../../services/auth.guard';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudService } from '../../services/crud.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-chat-wrap',
  templateUrl: './chat-wrap.component.html',
  styleUrls: ['./chat-wrap.component.scss'],
})
export class ChatWrapComponent implements OnInit, OnChanges {
  private subscription!: Subscription;
  private auth = inject(AuthenticationService);
  
  chatName: string = '';
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  det: any;
  sellerDetails!: SellerDetailsChat;
  message!: string;

  //User Details
  userObj: any;
  buyerId: number = 0;
  buyerName: string = '';
  institueName: string = '';
  profilePhoto: string = '';
  userEmail: string = '';

  showingChat: boolean = false;
  maximizeChat: boolean = true;

  sampleDetails: any;
  sellerList: any;
  relPath: any;

  messages: any[] = [];
  imageUrls$!: Observable<any[]>;

  smilemessage=""
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
  showEmojiPicker = false;
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    const { smilemessage } = this;
    const text = `${smilemessage}${event.emoji.native}`;
    this.smilemessage = text;
    this.message = text;
  }

  constructor(
    private authguard: AuthGuard,
    private chatService: ChatService,
    private db1: AngularFireDatabase,
    private crud: CrudService
  ) {}

  ngOnChanges() {
    console.log('in chat wrap');
    this.sellerDetails = this.chatService.getCallChatWrap();

    if (localStorage.getItem('token')) {
      this.setUserDetails();
      this.getChatList();
      // this.chatService.getSellerList(this.buyerId).subscribe((res) => {
      //   this.sellerList = res;
      // });
    }
  }

  ngOnInit(): void {
    this.subscription = this.chatService.chatMsg$.subscribe((res) => {
      this.sellerDetails = res;
      if (localStorage.getItem('token')) {
        this.setUserDetails();
      }else {
        this.authguard.openDialog();
      }
    });

    // this.getImageUrls()
  }



  //Setting Buyer Details
  setUserDetails() {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.buyerId = this.userObj.buyerId;
      this.buyerName = this.userObj.name;
      this.institueName = this.userObj.institueName;
      this.profilePhoto = this.userObj.avatar;
      this.userEmail = this.userObj.email
      this.showChat();
    }
  }

  showChat() {
    this.showingChat = true;
    this.maximizeChat = true;
    this.chatName = this.sellerDetails.companyName;
    this.getChatList();
    this.chatService
      .getMessages(
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .subscribe((messages) => {
        this.messages = messages;
        this.scrollToLastItem();
      });
    // this.chatService.getSellerList(this.buyerId).subscribe((res) => {
    //   this.sellerList = res;
    // });
  }

  //Selecting Image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFile) {
      const obj = {
        details: "",
        deviceId: '',
        device_type: 2,
        filePath: '',
        from: 'Buyer_' + this.buyerId.toString(),
        message: '',
        messageId: '',
        seen: false,
        seenTime: 0,
        time: new Date().getTime(),
        to: 'Seller_' + this.sellerDetails.sellerId,
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

  getImageUrls() {
    const imagesRef = this.db1.list('SeeUploads23/Uploads');
    this.imageUrls$ = imagesRef.valueChanges();
    this.imageUrls$.subscribe((res) => {
      console.log(res);
    });
  }

  saveDownloadURLToDatabase(downloadURL: string) {
    // Save the download URL to the Realtime Database
    this.db1.list('SeeUploads23/Uploads').push({ downloadURL });
  }

  updateData(event?: Event) {
    if(this.buyerId == 0) {
      return
    }
    this.smilemessage = ''
    this.showEmojiPicker = false;
    this.sendBuyerDetails();
    this.sendMessage();
    this.sendBuyerSellers();
    this.sendSellerBuyers();
    this.sendSellerDetails();
    const Event = event as KeyboardEvent;
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
      userType: 2,
    };
    if (this.buyerId != 0) {
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
      messageId: '',
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
      });
    this.chatService
      .getMessages(
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .subscribe((messages) => {
        if(messages) {
          console.log("messages recieved successfully")
          this.messages = messages;
          this.scrollToLastItem();
        }
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
          this.scrollToLastItem();
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
    if (this.buyerId != 0 ) {
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
      console.log('check seller Id');
    }
  }

  sendSellerBuyers() {
    const obj = {
      chatRequest: "0",
      companyId: this.buyerId.toString(),
      companyName: this.institueName, //buyer company
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
      console.log('check seller id');
    }
  }

  sendSellerDetails() {
    const obj = {
      activeNow: false,
      activeTime: 0,
      companyId: this.sellerDetails.sellerAccountId.toString(), //seller company
      comanyLogo: this.sellerDetails.companyLogo,
      companyName: this.sellerDetails.companyName, //seller company name
      createdAt: new Date().getTime(),
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

  getMessagesFromSeller(details: any) {
    this.sellerDetails.sellerAccountId = details.company_id;
    this.sellerDetails.sellerId = details.seller_id;
    this.sellerDetails.companyName = details.company_name;
    this.sellerDetails.companyLogo = details.company_image;
    this.chatName = details.company_name;
    this.chatService
      .getMessages1(details.company_id, details.seller_id, this.buyerId)
      .subscribe((messages) => {
        this.messages = messages;
        this.scrollToLastItem();
      });
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
          console.log(res)
        }
      },
      error: (err: HttpErrorResponse) => {
        this.noChatsFound = true;
      }
    })
  }

  @ViewChild('listContainer', { static: false }) listContainer!: ElementRef;
  scrollToLastItem(): void {
    const containerElement = this.listContainer.nativeElement;
    containerElement.scrollTop = containerElement.scrollHeight;
  }
  
}
