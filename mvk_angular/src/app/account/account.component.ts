import { Component, OnInit } from '@angular/core';
import { RfqService } from '../shared/services/rfq.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ChatService } from '../shared/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{

  private subscription!: Subscription;
  
  constructor(
    private rfq: RfqService,
    private router: Router,
    private authservice: AuthenticationService, 
    private chat: ChatService, 
  ) {}
  ngOnInit(): void {
    this.getUserDetails();
    this.getUnreadNotificationCount();
    this.subscription = this.rfq.rfqRead$.subscribe((res: boolean) => {
      this.getUnreadNotificationCount();
    });
    this.authservice.profilePic$.subscribe((image: string) => {
      this.profilePhoto = image;
    });
  }

  userName = 'Customer Name';
  profilePhoto = "";
  getUserDetails() {
    let userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    this.userName = userObj.name;
    this.profilePhoto = userObj.avatar;
  }

  unreadCount = 0;
  getUnreadNotificationCount() {
    let obj: any = {
      limit: 10,
    }
    this.rfq.getNotificationList(obj).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.unreadCount = res.unread_count;
        }
      }
    });
  }

  goToNotifiy() {
    this.router.navigateByUrl('/account/notifications');
  }

  panelOpenState = false;

  isHovered = false;
  onHover(isHovered: boolean) {
   this.isHovered = isHovered
  }
  
  showMenu = false;
  logout() {
    let token = localStorage.getItem('uniqueId') ?? '';
    if(token) {
      this.signout(token);
    } else {
      localStorage.clear();
      this.chat.unregisterFirebaseToken();
      this.chat.signOut(); 
      this.router.navigate(['/products']).then(() => {
        window.location.reload();
      });
    }
  }

  signout(token: string) {
    this.authservice.logout(token).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.chat.unregisterFirebaseToken();
          this.chat.signOut();  
          localStorage.clear();
          this.router.navigate(['/products']).then(() => {
            window.location.reload();
          });
        }
      }
    })
  }

}
