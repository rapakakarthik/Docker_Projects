import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { EmailPopupComponent } from 'src/app/shared/components/email-popup/email-popup.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-assist-chat',
  templateUrl: './assist-chat.component.html',
  styleUrls: ['./assist-chat.component.scss']
})
export class AssistChatComponent implements OnInit {
  chatName: string = '';

  //Upload Image
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  message!: string;

  //User Details
  userObj: any;
  buyerId: number = 0;
  buyerName: string = '';
  institueName: string = '';
  profilePhoto: string = '';

  // Assist Details
  assistDetails = {
    assistId: 0,
    assistName: '',
    assistPhoto: ''
  }

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
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    const text = this.smilemessage + event.emoji.native;
    this.smilemessage = text;
    this.message = text;
  }

  @ViewChild('listContainer', { static: false }) listContainer!: ElementRef;
 
  constructor(
    private chatService: ChatService,
    private crud: CrudService,
    private db1: AngularFireDatabase, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.changeActivestatus(false);
  }

  ngOnInit(): void {
    this.openMainChat();
  }

  userEmail: string = '';
  dialogRef: any;
  openMainChat() {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userEmail = this.userObj.email
      if(this.userEmail) {
        this.setUserDetails(this.userObj);
        this.setAssistDetails(this.userObj.assignee);
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


  //Setting Buyer Details
  setUserDetails(obj: any) {
    this.buyerId = obj.buyerId;
    this.buyerName = obj.name;
    this.institueName = obj.institueName;
    this.profilePhoto = obj.avatar;
    this.changeActivestatus(true);
  }

  setAssistDetails(obj: any) {
    this.assistDetails.assistId = obj.assist_user_id;
    this.assistDetails.assistName = obj.assist_user_name;
    this.assistDetails.assistPhoto = obj.assist_user_photo;
    this.getAssistMessages();
  }

  //Selecting Image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // this.uploadFile();
  }

  // Upload file function
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
        to: 'Seller_' + this.assistDetails.assistId.toString(),
        type: 'image',
      };
      this.chatService.uploadImage(
        this.selectedFile,
        obj,
        this.assistDetails.assistId,
        this.assistDetails.assistId,
        this.buyerId
      );
    }
  }

  saveDownloadURLToDatabase(downloadURL: string) {
    this.db1.list('SeeUploads23/Uploads').push({ downloadURL });
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
      to_id: this.assistDetails.assistId.toString(),
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

  // Assist Chat
  
  scrollToLastItem(): void {
    const containerElement = this.listContainer.nativeElement;
    containerElement.scrollTop = containerElement.scrollHeight;
  }

  sendAssist(event?: Event) {
    const Event = event as KeyboardEvent;
    this.smilemessage = "";
    this.showEmojiPicker = false;
    this.sendABMessages();
    this.sendABDetails();
    Event.preventDefault();
  }

  lastTime = 0;
  assistMessages: Message[] = [];
  getAssistMessages() {
    const buyerId = this.buyerId;
    this.chatService.getAssistMessages(buyerId).subscribe({
      next: (messages: any) => {
        if(messages) {
          this.assistMessages = messages;
          let length = messages.length;
          if(length > 0) {
            this.lastTime = messages[length - 1].time;
          }
          setTimeout(() => {
            this.scrollToLastItem();
          })
        }
      },
      error: (err) => {
        
      },
    })
  }

  sendABMessages() {
    const buyerId = this.buyerId;
    const msg = this.message;
    const type = "text";
    let obj = {
      assistName: this.assistDetails.assistName,
      device_type: "3",
      filePath: "",
      from: "B_" + buyerId,
      message: msg,
      messageId: "",
      seen: false,
      seenTime: 0,
      time: new Date().getTime(),
      to: this.assistDetails.assistId.toString(),
      type: type
    }
    let currentTime = new Date().getTime();
    let previousTime = this.lastTime;
    let timeGap = currentTime - previousTime;
    let sendAsSeller = timeGap >= 6 * 60 * 60 * 1000;
    this.chatService.createAssistBuyerMessages(obj, buyerId).then(r => {
      this.message = "";
      this.scrollToLastItem();
      console.log("Updated AssitDetails");
      if(sendAsSeller) {
        this.sendABMessageAsSeller();
      }
    });
  }

  sendABMessageAsSeller() {
    const buyerId = this.buyerId;
    const msg = `Thank you for contacting us, ${this.buyerName}. Please let us know how can we help you.`;
    const type = "text";
    let obj = {
      assistName: this.assistDetails.assistName,
      device_type: "3",
      filePath: "",
      from: this.assistDetails.assistId.toString(),
      message: msg,
      messageId: "",
      seen: true,
      seenTime: new Date().getTime(),
      time: new Date().getTime(),
      to: "B_" + buyerId,
      type: type
    }
    this.chatService.createAssistBuyerMessages(obj, buyerId).then(r => console.log("Updated AssitDetails as seller"));
  }

  sendABDetails() {
    const buyerId = this.buyerId;
    let obj = { 
      activeNow: true,
      activeTime: new Date().getTime(),
      createAt: new Date().getTime(),
      fcmRegToken: "",
      phoneNo: "",
      profilePhoto: this.profilePhoto,
      userId: "B_" + buyerId,
      userName: this.buyerName
    }
    this.chatService.createAssistBuyerDetails(obj, buyerId).then(r => console.log("updated buyerDetails"));
  }

  changeActivestatus(status: boolean) {
    const buyerId = this.buyerId;
    const activeStatus = status;
    const time = new Date().getTime();
    this.chatService.updateAssistBuyerDetails(buyerId, activeStatus, time)
  }
}

interface Message {
  assistName: string,
  device_type: string,
  filePath: string,
  from: string,
  message: string,
  messageId: string,
  seen: boolean,
  seenTime: number,
  time: number,
  to: string,
  type: string
}