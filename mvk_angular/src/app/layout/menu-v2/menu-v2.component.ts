import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-v2',
  templateUrl: './menu-v2.component.html',
  styleUrls: ['./menu-v2.component.scss']
})
export class MenuV2Component implements OnInit {

  menulist: any[] = [];
  loader: boolean = true;

  // @Output() getAppShow = new EventEmitter();
  @Output() getAppHide = new EventEmitter();
  constructor(
    private authService: AuthenticationService,
    private curdService: CrudService,
    private router: Router,
    private renderer: Renderer2,
  ) {}
  ngOnInit(): void {
    this.loginCheck();
    this.getMainCategories();
    
    this.authService.profilePic$.subscribe((image: string) => {
      this.profilePhoto = image;
    });
  }

  islog = false;
  userObj: any;
  displayName = "";
  profilePhoto = "";
  loginCheck() {
    if (localStorage.getItem('token')) {
      this.islog = true
      if (localStorage.getItem('userObj')) {
        this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}')
      }
      let name = this.userObj.name;
      this.profilePhoto = this.userObj.avatar;
      if (name != '' && name != null) {
        this.displayName = name
      }
      else {
        this.displayName = this.userObj.mobile;
      }
    }
    else {
      this.islog = false
    }
  }

  getMainCategories() {
    this.curdService.getMenuV2().subscribe({
      next: (res) => {
        this.loader = false;
        if(res.status == 200) {
          this.menulist = res.data;
          this.subCatList = [...this.menulist[0].category];
          this.room_name = this.menulist[0].room_name;
          this.leastCatList = [...this.subCatList[0].sub_cat];
          this.sub_cat_name = this.subCatList[0].cat_name
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.error("menu category error", err.message);
      }
    });
  }

  categoryLink() {
    this.router.navigateByUrl('category/all');
  }

  subCatList: any[] = [];
  leastCatList: any[] = [];

  room_name: string = "";
  fillSubCatList(list: any[], room_name: string) {
    this.room_name = room_name;
    this.subCatList = list;
    this.leastCatList = list[0].sub_cat;
    this.sub_cat_name = list[0].cat_name;
    this.sub_cat_id = list[0].cat_id;
  }

  sub_cat_name: string ='';
  sub_cat_id: number = 0;
  fillLeastCatList(list: any[], cat_name: string, catId: number) {
    this.sub_cat_name = cat_name;
    this.sub_cat_id = catId;
    this.leastCatList = list;
    this.sub_cat_id = catId;
  }

  isOpen = false;
  
  goTo(route: string, id: number, name: string) {
    this.close()
    let category_name = encodeURIComponent(name);
    let url = category_name + "-" + id
    this.router.navigate([route, url]);
  }
  open() {
    this.isOpen = true;
    this.renderer.addClass(document.body, 'disable-scroll');
  }

  close() {
    this.isOpen = false;
    this.renderer.removeClass(document.body, 'disable-scroll');
  }
  // navTo(route: string) {
  //   // document.body.style.overflow = "auto";
  //   this.router.navigate([route]);
  // }

  // toggleShow(type: string, status: boolean) {
  //   if(status) {
  //     this.getAppShow.emit(type);
  //   } else {
  //     this.getAppHide.emit(type);
  //   }
  // }

  sellerUrl = environment.sellerUrl;
}

