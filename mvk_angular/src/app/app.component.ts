import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { getMessaging, getToken, onMessage} from 'firebase/messaging';
import { filter, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './shared/services/authentication.service';
import { ChatService } from './shared/services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from './shared/services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RfqService } from './shared/services/rfq.service';
import { EventPopupComponent } from './shared/components/event-popup/event-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'MyVerkoper';

  dialogRef: any;

  @ViewChild('confirmation', { static: true })
  confirmation!: TemplateRef<any>;
  userId: number = 0;
  url = '';
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private authservice: AuthenticationService, 
    private chat: ChatService, 
    private toastr: ToastrService,
    private crud: CrudService,
    private rfq: RfqService,

    ) {
    // private _swPush: SwPush
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.url = evt.url;
        if(evt.url != '/products' && evt.url != "/manufacture") {
          window.scrollTo(0, 0);
        }
      }
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            // console.log(child)
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.titleService.setTitle(data + ' - Myverkoper.com');
        }
        else {
          this.titleService.setTitle('MyVerkoper: B2B Ecommerce Marketplace for Education Institutions');
        }
      });
  }
  ngOnInit(): void {
    this.webVisitCount();
    this.getEventBanner();
    this.checkSession();
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
      // if(this.userId) {
        // this.requestPermission();
        // this.listen();
        // this.requestPermission2();
      // }
    }
  }

  applink() {}

  openapplinkPopup(): void {
    this.dialogRef = this.dialog.open(this.confirmation, {});
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      console.log('The dialog was closed', _result);
      if (_result == 'Yes') {
      }
    });
  }

  onNoClick(e: any): void {
    this.dialogRef.close(e);
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
        //  console.log("Hurraaa!!! we got the token.....");
        //  console.log(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }

  requestPermission2() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    })
  }

  message: any =  null;
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
    });
  }

  checkSession() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token') ?? "";
      this.rfq.getUserDetails(token).subscribe({
        next: (res: any) => {
          if(res.status == 200 && this.url == '/error') {
            // if(res.data.delete_request.status === 'Approved') {
            //   this.logout();
            // } else {
            // }
            this.router.navigate(['/'])
          }
          if(res.status == 401) {
            this.logout();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.router.navigate(['error']);
        }
      })
      // console.log("signed in");

    } else {
      // console.warn("not signed in");
    }
  }

  logout() {
    this.chat.signOut();
    this.authservice.deleteToken();
    this.authservice.deleteUID();
    this.authservice.deleteUserObj();
    this.router.navigate(['/signin']);
    this.toastr.error('Session Expired Signin again');
  }

  // banners: any[] = [];
  mainBanner: any;
  count = 0;
  event_name = "";
  getEventBanner() {
    this.crud.getEventBanner().subscribe({
      next: (res: any) => {
        if(res.status == 200) {
          // this.banners = res.data;
          this.mainBanner = res.data[0];
          // this.event_name = res.data[0].event_name;

          // let newEventObj = {
          //   name: this.event_name,
          //   count: 0
          // }
          // let event_obj = localStorage.getItem('event_obj');
          // if(event_obj) {
          //   let eventObj = JSON.parse(event_obj);
          //   this.count = eventObj.count;
          //   if(eventObj.name != this.event_name) {
          //     localStorage.removeItem('event_obj');
          //     localStorage.setItem('event_obj', JSON.stringify(newEventObj));
          //     this.count = 0;
          //   }
          // }
          // this.count = localStorage.getItem
          this.openPopup(this.mainBanner);
          // if(this.count <= 1) {
          // }
        }
      },
      error: (err: HttpErrorResponse) => {}
    })
  }

  openPopup(data: any) {
    this.dialogRef = this.dialog.open(EventPopupComponent, {
      width: '750px',
      data,
      disableClose: true,
      panelClass: "event_dialog"
    });
    this.dialogRef.afterClosed().subscribe(() => {
      // this.count++;
      // let event = {
      //   name: this.event_name,
      //   count: this.count
      // }
      // localStorage.setItem('event_obj', JSON.stringify(event));
    });
  }

  webVisitCount() {
    let isVisited = localStorage.getItem('isVisited');
    if(!isVisited) {
      this.crud.webVisitCount().subscribe({
        next: (value: any) => {
          localStorage.setItem('isVisited', 'true');
        }
      })
    }
  }

}
