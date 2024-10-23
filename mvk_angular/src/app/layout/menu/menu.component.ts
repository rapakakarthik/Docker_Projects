import { V } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { findIndex } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit{
  linkTo: string = '/products';
  menulist: any[] = [];
  clsName: any;
  loader: boolean = true;
  currentPage: string = '';
  @Input() menuType!: any;
  constructor(
    private curdService: CrudService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getMenuDetails();
  }

  // ngAfterViewInit(): void {
  //   this.getCurrentURLEnding();

  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.getCurrentURLEnding();
  //     }
  //   });
  // }

  // showMenu: boolean = true;
  // getCurrentURLEnding(): void {
  //   const currentURL: string = this.location.path();
  //   const urlEnding: string = currentURL.substring(currentURL.lastIndexOf('/') + 1);
  //   if(urlEnding == 'products') {
  //     this.showMenu = false;
  //   }else {
  //     this.showMenu = true;
  //   }
  // }
  

  menuExpanded = false;

  toggleMenu() {
    setTimeout(() => {
      this.menuExpanded = !this.menuExpanded;
    }, 0);
  }

  @HostListener('window:click', ['$event'])
  listenToOutsideClick() {
    const target = event!.target as HTMLElement;
    const isToggler = target.getAttribute('id') === 'navbarDropdown';
    if (!this.menuExpanded || isToggler) {
      return;
    }

    this.menuExpanded = false;
  }


  getMenuDetails() {
    this.curdService.getMenuV3().subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.menulist = value.data;
          this.loader = false;
        } else {
          this.loader = false
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false
        console.error("menu error homepage", err.message)
      }
    });
  }

  getMenuChildDetails(id: number, i: number) {
    const index = i;
    if(!(this.menulist[i].without_l3.length > 0 || this.menulist[i].with_l3.length > 0)) {
      // const index = this.menulist.findIndex((element) => element.category_id == id);
      this.curdService.getMenuV3Child(id).subscribe({
        next: (value) => {
          if(value.status == 200) {
          if(value.data.with_l3.length > 0) {
              this.menulist[index].with_l3 = value.data.with_l3;
          }
          if(value.data.without_l3.length > 0) {
              this.menulist[index].without_l3 = value.data.without_l3;
          }
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error("menu error homepage", err.message)
        }
      });
    }
  }

  getMainClass(mlist: any) {
    let l2wl3 = mlist.with_l3.length;
    let l2woutl3 = mlist.without_l3.length;

    if (l2wl3 <= 2) {
      // 1 or 2
      return 'flex25';
    } else if (l2wl3 <= 4) {
      return 'flex50';
    } else if (l2wl3 <= 6) {
      return 'flex75';
    } else if (l2wl3 > 6) {
      return 'flex100';
    } else {
      return 'noflex';
    }
  }

  getClass(item: any) {
    if (item && item.length > 0 && item.length < 9) {
      return 'flex' + item.length;
    } else if (item && item.length > 8) {
      return 'flex9';
    } else {
      return '';
    }
    // if (item.status === 'success' && item.value > 5) {
    //   return 'success';
    // } else if (item.status === 'warning' || (item.status === 'success' && item.value <= 5)) {
    //   return 'warning';
    // } else {
    //   return 'error';
    // }
  }

  categoryLink() {
    this.router.navigateByUrl('category/all');
  }

  goTo(route: string, item: any): void {
    let id: number = 0
    id = item.category_id || item.parent_id;
    let category_name = <string>item.category_name;
    category_name = encodeURIComponent(category_name).toLowerCase();
    let url = category_name + "-" + id
    this.router.navigate([route, url]);
  }
}
