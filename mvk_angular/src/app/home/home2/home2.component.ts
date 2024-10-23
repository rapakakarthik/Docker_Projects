import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { SigninComponent } from 'src/app/authentication/signin/signin.component';
import { RfqHomeComponent } from 'src/app/shared/components/rfq/rfq-home/rfq-home.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import * as BannerActions from '../actions/banner.actions';
@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss'],
})
export class Home2Component implements OnInit, AfterViewInit {
  productSchema: any;
  userObj = {
    email: '',
    mobile: 0,
    // userId: 0,
    name: '',
    buyerId: 0,
    institueName: '',
    avatar: '',
    assignee: {}
  }
  
  getTypes: any;
  getStates: any = [];
  selectedChipIndex: number = 0;
  newProductType: string = 'top_search'; 
  

  customOptions: OwlOptions = {
    loop: false,
    autoplayTimeout: 5000,
    slideBy: 1,
    items:3,
    autoplay: false,
    autoplaySpeed: 1000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 0,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      250: {
        items: 2.2,
        autoplay: true
      },
      600: {
        items: 3,
      }
    },
    nav: false,
   
  };  
  customOptions2: OwlOptions = {
    loop: false,
    autoplayTimeout: 5000,
    slideBy: 1,
    items:5,
    autoplay: false,
    autoplaySpeed: 1000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 0,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      250: {
        items: 2,
      },
      600: {
        items: 3,
      },
      800: {
        items: 4,
      },
      1000: {
        items: 5,
      }
    },
    nav: false,
   
  };
  customOptions3: OwlOptions = {
    loop: false,
    autoplayTimeout: 5000,
    slideBy: 4,
    items:9 ,
    autoWidth:false,
    autoplay: false,
    autoplaySpeed: 300,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 0,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      250: {
        items: 2.5,
        loop: true,
        autoplay: true,
        nav: false,
      },
      600: {
        items: 3.5,
        loop: true,
        autoplay: true,
        nav: false,
      },
      700: {
        items: 5,
        loop: true,
        autoplay: true,
        nav: false,
      },
      1000: {
        items: 8,
        nav: false
      }
    },
    nav: true,
   
  };




  constructor(
    private api: RecommendationService,
    private router: Router,
    private service: RfqService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private location: Location,
    private store: Store
  ) {}
  ngAfterViewInit(): void {
    this.getTopTypes();
    this.getHomeTopProducts(this.newProductType);
    this.getClasses();
    this.getPrimeSuppliers();
    // this.getEliteSuppliers();
    // this.getHomeBanner()
    // this.getAllStates();
  }

  
  ngOnInit(): void {
    this.getRecommendedBanners();
    this.getUserDetails();
    this.generateProductSchema1()
  }

  showSignUp(step: number) {
    const dialogRef = this.dialog.open(SigninComponent, {
      width: '450px',
      data: step
    });
    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }

  classData: any;
  getClasses() {
    this.api.getClasses().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.classData = value.data;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      },
    });
  }

  topProductTypes: any = [];
  topProductTitle = '';
  topCompanyTypes: any[] = [];
  topCompanyTitle: string = '';
  recommendSupplierLoad = true;
  getTopTypes() {
    this.api.getCompanySpotlights().subscribe({
      next: (value: any) => {
        this.recommendSupplierLoad = false;
        if (value.status === 200) {
          if(Object.keys(value.data.company).length > 0) {
            this.topCompanyTypes = value.data.company.recommendation_types;
            this.topCompanyTitle = value.data.company.title;
          }
          if(Object.keys(value.data.product).length > 0) {
          this.topProductTypes = value.data.product.recommendation_types;
          this.topProductTitle = value.data.product.title;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.recommendSupplierLoad = false;
        console.error(err.message, err.error);
      },
    });
  }

  tabChange(id: string, index: number) {
    this.selectedChipIndex = index;
    this.newProductType = id;
    this.getHomeTopProducts(this.newProductType);
  }

  newProductLoader: boolean = true;
  newProductData: any[] = [];
  newProductInfo: any[] = [];
  newProductTitle: string = '';
  getHomeTopProducts(type: string) {
    this.newProductLoader = true;
    this.newProductData = [];
    // this.api.getHomeTopProducts(type).subscribe({
    //   next: (res: any) => {
    //     this.newProductLoader = false;
    //     if (res.status === 200) {
    //       if(!this.newProductTitle) this.newProductTitle = res.info.title;
    //       if(this.newProductInfo.length === 0) this.newProductInfo = [...res.info.types];
    //       this.newProductData = [...res.data];
    //     }
    //   },  
    //   error: (err: HttpErrorResponse) => {
    //     this.newProductLoader = false;
    //     console.error(err.message, err.error);
    //   },
    // })
  }
  gotonavigation(p: any) {
    let idlink = this.newProductType;
    let idlink1 = p.cat_id;
    let category_name: string = p.cat_name;
    category_name = encodeURIComponent(category_name).toLowerCase();
    // category_name = category_name.replaceAll(" ", "-").toLowerCase();
    let url = category_name + "-" + idlink1;
    this.router.navigate(['/category', idlink, url]);
    // this.router.navigate(['/category', idlink, idlink1]);
  }

  goTo(path:string, route: string) {
    this.router.navigate([`category/${path}`, route])
  }

  
  singlebanners: any[]= [];
  multibanners:any[]=[];
  justForInfo: any;
  solidBanner: any;
  getRecommendedBanners() {
    this.api.banners$.subscribe(() => {
      let value = this.api.getBanners();
      if (value.status === 200) {
        this.justForInfo = value.data.just_for[0];
        this.singlebanners = value.data.single_banner;
        this.multibanners = value.data.multi_banner;
        this.solidBanner = value.data.solid_banner;
      } else {
        console.error(value.message, value.error);
      }
    })
    
  }

  primeSuppliers: any[] = [];
  getPrimeSuppliers() {
    this.api.getPrimeSuppliers().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.primeSuppliers = value.data;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      },
    });
  }

  eliteSuppliers: any[] = [];
  getEliteSuppliers() {
    this.api.getEliteSuppliers().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.eliteSuppliers = value.data;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      },
    });
  }

  showContent: boolean = false;
  getUserDetails() {
    const token = localStorage.getItem('token') ?? "";
    this.service.getUserDetails(token).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.islogin = true;
        if(value.data.sigup_process_completed != "true") {
          // this.showSignUp(value.data.signup_step);
        }
          this.setLoginDetails(value.data);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  islogin: boolean = false;

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


  setLoginDetails(value: any) {
    this.authenticationService.deleteUserObj();
    this.userObj.email = value.mob_email ?? "";
    this.userObj.mobile = value.mob_user_phone ??  0;
    this.userObj.name = value.mob_first_name ?? "";
    this.userObj.buyerId = value.pk_mobile_user_id ?? 0
    this.userObj.institueName = value.mob_user_school_name ?? "";
    this.userObj.avatar = value.mob_user_avatar ?? "";
    this.userObj.assignee = value.assignee_info;
    this.authenticationService.setUserObj(JSON.stringify(this.userObj));
    this.showContent = true;
  } 

  // Generating schema function
  generateProductSchema(): string {

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MyVerkoper",
      "url": "https://www.myverkoper.com/",
      "logo": "https://www.myverkoper.com/assets/images/logo.gif",
      "sameAs": [
        "https://www.facebook.com/Myverkoper",
        "https://www.linkedin.com/company/myverkoper/",
        "https://www.instagram.com/myverkoperofficial/",
        "https://twitter.com/MyVerkoper"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 9666604766",
          "contactType": "customer service",
          "email": "we@myverkoper.com",
          "areaServed": "IN",
          "availableLanguage": "en"
        }
      ]
    }
    return JSON.stringify(schema);
  }



  generateProductSchema1(): void {
    // Your logic to generate JSON-LD
    this.productSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MyVerkoper",
      "url": "https://www.myverkoper.com/",
      "logo": "https://www.myverkoper.com/assets/images/logo.gif",
      "sameAs": [
        "https://www.facebook.com/Myverkoper",
        "https://www.linkedin.com/company/myverkoper/",
        "https://www.instagram.com/myverkoperofficial/",
        "https://twitter.com/MyVerkoper"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 9666604766",
          "contactType": "customer service",
          "email": "we@myverkoper.com",
          "areaServed": "IN",
          "availableLanguage": "en"
        }
      ]
    }

    this.appendJsonLdScript();
  }
  private appendJsonLdScript(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(this.productSchema);

    // Append the script to the document head
    document.head.appendChild(script);
  }

  productRoute(type: string) {
    this.router.navigate(['/category/topranking'])
  }

}
