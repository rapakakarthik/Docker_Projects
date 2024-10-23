import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent {
  productImages: string[] = ['https://picsum.photos/id/120/200', 'https://picsum.photos/id/121/200', 'https://picsum.photos/id/122/200', 'https://picsum.photos/id/123/200', 'https://picsum.photos/id/124/200']

}
