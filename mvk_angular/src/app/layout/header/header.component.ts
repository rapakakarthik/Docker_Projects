import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqHomeComponent } from 'src/app/shared/components/rfq/rfq-home/rfq-home.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewInit {

  key!: string;
  selected: string = 'product'
  routerlink: string = 'searchresults'
  islog: boolean = false;
  maximizeChat: boolean = true;
  userObj: any;
  mobile: any = '';
  name: any = '';
  displayName: any = '';
  profilePhoto = '';
  @Input() search: boolean =true;
  @Input() className!: string;
  searchOpen:boolean=false;
  showRfq = false;

  constructor(
    private authservice: AuthenticationService, 
    private _crud: CrudService, 
    private chat: ChatService, 
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private rfq: RfqService,
    private ngZone: NgZone,
    private toastr: ToastrService,
  ) { }
  ngOnInit(): void {
    this._crud.search$.subscribe(() => {
      if(this.islog) {
        this.getSearchRecommendations();
      } else {
        let historyStr = localStorage.getItem('history');
        if(historyStr) {
          this.localHistory = JSON.parse(historyStr);
        }
      }
    })
    this.onViewPage();
    this.setDetails();
    this.getSearchRecommendations();
    this.changePlaceHolder();
    // this.getMainCategories();

    this.profileImg = localStorage.getItem('profilePic') || ''; 
    this.authservice.profilePicEvent.subscribe(image => this.profileImg = image);  
  }
  
  profileImg : string = '';

  disableSearch: boolean = false;
  onViewPage() {
    const currentURL: string = this.location.path();
    if (currentURL.includes('/product/view/')) {
      this.disableSearch = true;
    }
    if(currentURL.includes('/category')) {
      this.showRfq = true;
    }
  }

  setDetails() {
    if (localStorage.getItem('token')) {
      this.islog = true
      this.callAuthAPIs();
      if (localStorage.getItem('userObj')) {
        this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}')
      }
      this.mobile = this.userObj.mobile;
      this.name = this.userObj.name;
      this.profilePhoto = this.userObj.avatar;
      if (this.name != '' && this.name != null) {
        this.displayName = this.name
      }
      else {
        this.displayName = this.mobile
      }
    }
    else {
      this.setHistory();
      this.islog = false
    }
  }

  callAuthAPIs() {
    this.getNotificationList();
  }

  notifications: any[] = [];
  totalCount = 0;
  getNotificationList() {
    this.rfq.getNotificationList({limit:5, skip:0}).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.notifications = res.data;
        }
        else {
          this.notifications = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error); 
      }
    });
  }

  ngAfterViewInit() {   
    this.getCurrentURLEnding();
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.getCurrentURLEnding();
        const url = event.urlAfterRedirects;
        if (!url.includes('/searchresults')) {
          this.clearSearch();
        }
        if(url.includes('/category')) {
          this.showRfq = true;
        } else {
          this.showRfq = false;
        }
      });
  }

  showMenu: boolean = false;
  getCurrentURLEnding(): void {
    const currentURL: string = this.location.path();
    // const urlEnding: string = currentURL.substring(currentURL.lastIndexOf('/') + 1);
    if(currentURL.includes('account') ||  this.className=='account_header') {
      this.showMenu = false;
    }else {
      this.showMenu = true;
    }
  }

  clearSearch() {
    this.key = '';
  }
  
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  updateData(key: string) {
    this.searchQuery = key;
    if (key != undefined && key.trim() != "") {
      const uri = encodeURIComponent(key)
      // console.log(uri)
      this.relatedWords = [];
      this.router.navigate(['searchresults/', key, this.selected]).then(() => {
        this.showSearchDropdown = false;
        this.searchInput.nativeElement.blur();
      })
      this.searchOpen = false;
    }
  }

  showHistory = true;
  relatedWords: {id: number, name: string, type: string}[] = [];
  getSearchKeywords(): void {
    this.relatedWords = [];
    if (this.searchQuery.length >= 3) {
      this.showHistory = false;
      this._crud.getSearckKeywordsV2(this.searchQuery).subscribe({
        next: (value) => {
          if(value.status == 200) {
            this.relatedWords = value.data;
          }
        },
        error: (err) => {
          
        },
      })
    } else {
      this.showHistory = true;
      this.relatedWords = [];
    }
  }

  gotomyaccount() {
    this.router.navigate(['/account/profile']);
  }
  logout() {
    let token = localStorage.getItem('uniqueId') ?? '';
    if(token) {
      this.signout(token);
    } else {
      localStorage.clear();
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
          // this.authservice.deleteToken();
          // this.authservice.deleteUserObj();
          // localStorage.removeItem("uniqueId");
          localStorage.clear();
          this.router.navigate(['/products']).then(() => {
            window.location.reload();
          });
        }
        else if(value.status == 401) {
          this.logoutV2();
        }
      },
      error: (err: HttpErrorResponse) => {

      }
    })
  }

  logoutV2() {
    this.chat.signOut();
    this.authservice.deleteToken();
    this.authservice.deleteUID();
    this.authservice.deleteUserObj();
    this.router.navigate(['/signin']);
    this.toastr.error('Session Expired Signin again');
  }


  mobilesearchfn() {
    // this.searchOpen = !this.searchOpen;
    this.applyClass = !this.applyClass;
  }

  dialogRef: any;
  isNotificationOpened = false;
  openNotifications() {
    if(this.isNotificationOpened) {
      this.dialogRef.close();
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '200px';
    dialogConfig.position = {
      top: '40px',
      right: '70px'
    };
    this.dialogRef = this.dialog.open(NotificationComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      // this.location.replaceState(this.previousUrl);
    });
  }

  unreadCount = 12;
  getUnreadNotificationCount() {
    let obj: any = {
      buyer_id: 0,
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

  goTo(id: number, route: string) {
    this.router.navigate([route, id]);
    this.searchInput.nativeElement.blur();
  }

  goToNotifications() {
    this.router.navigate(['/account/notifications'])
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  
  openRFQForm() {
    if (!localStorage.getItem('token')) {
      // alert("Please Sign In First")
      this.openDialog();
    } else {
      this.dialogRef = this.dialog.open(RfqHomeComponent, {
        width: '1000px',
      });
      this.dialogRef.afterClosed().subscribe((_result: any) => {});
    }
  }

  goToRfqQuote() {
    this.router.navigateByUrl("/rfq-quote");
  }

  getAppShow = false;
  buyerHubShow = false;

  toggleShow(type: string) {
    if(type == 'buyerHub'){
      this.buyerHubShow = true;
    }else if(type == 'getApp'){
      this.getAppShow = true;
    }
  }

  toggleHide(type: string) {
    if(type == 'buyerHub'){
      this.buyerHubShow = false;
    }else if(type == 'getApp'){
      this.getAppShow = false;
    }
  }

  isAnimated = false;

  showSearchDropdown = false;
  focusSearch(){
    this.isAnimated = true;
    if(this.searchQuery.length < 3) {
      this.showSearchDropdown = true;
    }
  }

  stopAnimation() {
    this.isAnimated = false;
  }

  clickSearch(event: Event){
    event.stopPropagation();
  }

  applyClass = true;
  closeSearch(){
    this.applyClass = !this.applyClass;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    this.showSearchDropdown = false;
  }

  searchQuery: string = '';

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.ngZone.run(() => {
        this.searchQuery = transcript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };
  }

  recommendations: string[] = [];
  recToShow: string[] = [];
  history: {id: number, search_key: string}[] = [];
  showMoreHistory: {id: number, search_key: string}[] = [];
  getSearchRecommendations() {
    this._crud.getSearchRecommendations().subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.recommendations = value.data.recommendations;
          this.history = value.data.search_results;
          if(this.showMoreHistory.length <= 4) {
            this.showMoreHistory = this.history.slice(0,4);
          } else {
            this.showMoreHistory = this.history;
          }
          this.recToShow = this.recommendations.slice(0,4);
        }
      }
    })
  }

  
  delete(id: number){
    // let index = this.history.findIndex(list => list.id == id);
    this._crud.deleteHistory(id).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          // this.history.splice(index, 1);
          this.getSearchRecommendations();
        }
      }
    })
  }

  deleteLocalHistory(index: number){
    this._crud.deleteLocalHistory(index);
    this.localHistory.splice(index, 1)
  }

  index = 0;
  refresh() {
    this.index += 4;
    if(this.index >= 12) {
      this.index = 0;
    }
    this.recToShow = this.recommendations.slice(this.index, this.index + 4);
  }

  localHistory: string[] = [];
  setHistory() {
    if(!this.islog) {
      let historyStr = localStorage.getItem('history');
      if(historyStr) {
        this.localHistory = JSON.parse(historyStr);
      }
    }
  }

  showMoreText = 'Show More';
  showMore() {
    if(this.showMoreHistory.length > 4) {
      this.showMoreText = 'Show More';
      this.showMoreHistory = this.history.slice(0,4);
    } else {
      this.showMoreText = 'Show Less';
      this.showMoreHistory = this.history;
    }
  }

  goToSginIn() {
    let history = this.location.path();
    this.router.navigateByUrl(`/signin?return_to=${history}`);
  }
  
  // search keyword suggestions in searchbar 
  getMainCategories() {
    this._crud.getMainCategories().subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.searchCategories = value.data;
          this.placeHolder = this.searchCategories[0].category_name;
        }
      }, 
      error: (err: HttpErrorResponse) => {

      }
    })

  }

  searchCategories: any[] = ['Books', 'Uniforms', 'E-Learning', 'Stationery', 'Electronics', 'Costumes & Fancy Dresses', 'Shoes', 'Toys & Games', 'Furniture', 'Lab Supplies & Lab Setup', 'Sports & Play', 'Bags & Backpacks', 'Lunch Boxes, Bottles & Flasks', 'Newspapers & Magazines', 'Software Solutions', 'Business Planning & Management', 'Digital Printing Services', 'Student Projects', 'Safety & Prevention'];
  placeHolder: string = 'Books';
  changePlaceHolder() {
    setInterval(() => {
      this.updatePlaceholder();
    }, 3000)
  }

  updatePlaceholder() {    
    const currentIndex = this.searchCategories.findIndex(category => category == this.placeHolder);
    const nextIndex = (currentIndex + 1) % this.searchCategories.length;
    this.placeHolder = this.searchCategories[nextIndex];
  }

  openNotify(data: any) {
    if(data.read_status == 0) {
      let id: number = data.id;
      this._crud.updateNotification(id).subscribe({
        next: (value: any) => {
          if(value.status === 200) {
            this.rfq.notificationRead();
            // let parsedData = JSON.parse(data.custom_data);
            if(data.type == "rfq" || data.type == "inquiry") {
              localStorage.setItem('notificationObject', data.custom_data);
              this.router.navigate(['account/viewdetails']);
            }
            else if (data.type == "quotation"){
              let id = JSON.parse(data.custom_data).rfq_id;
              this.router.navigate(['account/rfqdetails', id]);
            }
            // console.log(parsedData);
          }
          else {
            // this.toastr.warning("Something went wrong")
          }
        },
        error: (err: HttpErrorResponse) => {
          // this.toastr.error("Something went wrong")
        }
      })
    } else {
      // let parsedData = JSON.parse(data.custom_data);
      if(data.type == "rfq" || data.type == "inquiry") {
        localStorage.setItem('notificationObject', data.custom_data);
        this.router.navigate(['account/viewdetails']);
      }
      else if (data.type == "quotation"){
        let id = JSON.parse(data.custom_data).rfq_id;
        this.router.navigate(['account/rfqdetails', id]);
      }
      // console.log(parsedData);
    }
  }

}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
