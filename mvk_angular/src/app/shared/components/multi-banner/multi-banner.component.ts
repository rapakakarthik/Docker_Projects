import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { OwlOptions } from "ngx-owl-carousel-o";
import { RecommendationService } from "../../services/recommendation.service";
import { ScreenSizeService } from "../../services/screensize.service";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-multi-banner",
  templateUrl: "./multi-banner.component.html",
  styleUrls: ["./multi-banner.component.scss"],
})
export class MultiBannerComponent implements OnInit {
  slidesTotal: any;
  startPos: any;
  productClass = "";
  responsiveItems: any;
  customOptions: OwlOptions = {
    loop: true,
    autoplayTimeout: 3000,
    autoplay: true,
    slideBy:5,
    autoplaySpeed: 300,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 0,
    dots: false,
    navSpeed: 300,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1.2,
        nav: false,
      },
      260: {
        items: 1.2,
        nav: false,
      },
      600: {
        items: 3, 
        nav: false,    
      },
      900: {
        items: 5,
        nav: false,
      },
      1400: {
        items: 7,
      },
      1800: {
        items: 9,
      },
    },
    
    // onInitialized: this.handleCarouselInit,
    // onTranslated: this.handleCarouselTranslate
  };

  modifyItemsForResponsive(itemsToShow: number): void {
    this.responsiveItems = this.classes.slice(itemsToShow - 1);
  }

  handleCarouselInit(event: any): void {
    // this.slideBy();
    // this.slidesTotal = event.slides.length;
    // this.assignClass(this.slidesTotal);
  }

  @ViewChild('carousel') carousel: any;
  position = -1;
  slide = false;
  handleCarouselTranslate(event: any): void {
    this.unsubscribeTimer();
    // this.slideBy();
    // if(this.position != event.startPosition) {
    //   this.position = event.startPosition;
    //   if(!this.slide) {
    //     console.log("auto")
    //     this.slide = !this.slide;
    //     this.carousel.next();
    //   } else {
    //     console.log("triggers")
    //     this.slide = !this.slide;
    //   }
    // }
    // this.isSlided = false;
    // if (event.startPosition >= 3) {
    //   this.productClass = "movescroll";
    // } else {
    //   this.productClass = "";
    // }
    // if (event.property.name === 'next') {
    //   alert('Next arrow clicked');
    // } else if (event.property.name === 'prev') {
    //   alert('Previous arrow clicked');
    // }
  }

  centerImageIndex: number = 0;
  startPosition = 0;
  isSlided = false;
  onCarouselChanged(event: any) {
    // this.startPosition = event.startPosition;
    // if (event.slides.length > 0) {
    //   this.assignClass(event.slides.length);
    // }
  
  }

  assignClass(slideslength:any) {
    this.slidesTotal = Math.floor(slideslength / 2)
    this.centerImageIndex = this.slidesTotal + this.startPosition;
  }
  @Input() classData!: any;
  isSmallScreen = false;

  constructor(
    private router: Router,
    private api: RecommendationService,
    private screenSizeService: ScreenSizeService
  ) { }
  ngOnInit(): void {
    this.setDataFromInput();
    this.screenSizeService.getScreenWidth().subscribe((width) => {
      this.isSmallScreen = width < 768; // Adjust the threshold as per your requirement
    });
  }

  classes: any[] = [];
  classInfo: any;
  setDataFromInput() {
    this.classInfo = this.classData?.info;
    this.classes = this.classData?.classes;
  }

  goTo(categoryId: number, name: string) {
    this.api.postClasses(this.classes);
    let class_name = encodeURIComponent(name).toLowerCase();
    // let class_name = name.replaceAll(" ", "-").toLowerCase();
    let url = class_name + "-" + categoryId;
    this.router.navigate(["/recommendations/class", url]);
  }

  private timerSubscription!: Subscription;
  slideBy() {
    const timer = interval(4000);
    this.timerSubscription = timer.subscribe(() => {
      this.carousel.next();
    });
  }

  private unsubscribeTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
