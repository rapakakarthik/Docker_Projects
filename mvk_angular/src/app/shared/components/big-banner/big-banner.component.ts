import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RfqHomeComponent } from '../rfq/rfq-home/rfq-home.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-big-banner',
  templateUrl: './big-banner.component.html',
  styleUrls: ['./big-banner.component.scss'],
})
export class BigBannerComponent implements OnInit {
  @Input() bannerDetails!: any;
  @Input() solidBanner!: any;
  @Input() bannertype!: any;
  @Input() showGetQuote = false;
  desktopitem: number = 1;
  mobileitem: number = 1;
  customOptions!: OwlOptions;
  autoScroll = true;
  // isBannerDetails: boolean = false;

  constructor(private router: Router, public dialog: MatDialog, private location: Location) {}
  ngOnInit(): void {
    // this.isBannerDetails = this.bannerDetails == undefined
    // console.log(this.bannerDetails)
    if (this.bannertype == 'multi') {
      this.desktopitem = 2;
      this.autoScroll = false;
    } else {
      this.desktopitem = 1;
    }


    this.customOptions = {
      loop: true,
      autoplayTimeout: 5000,
      slideBy: 1,
      items: 6,
      autoplay: this.autoScroll,
      autoplaySpeed: 300,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      margin: 0,
      nav: true,
      dots: false,
      navSpeed: 700,
      navText: [
        '<i class="bi bi-chevron-left"></i>',
        '<i class="bi bi-chevron-right"></i>',
      ],
      responsive: {
        0: {
          items: this.mobileitem,
        },
        250: {
          items: this.mobileitem,
          loop: false,
          autoplay: false,
        },
        700: {
          items: this.desktopitem,
        },
        1000: {
          items: this.desktopitem,
        },
      },
    };

  }
  goTo(banner: any) {
    if(banner.have_link == 0) {
      return;
    }
    // console.log(banner);
    let link_type = banner.link_type;
    let id = banner.link_id;
    let link_name = banner.link_name;
    link_name = encodeURIComponent(link_name).toLowerCase();
    let url = link_name + "-" + id;
    this.router.navigate([link_type.toLowerCase() , url])
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  
  dialogRef: any;
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

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }
}
