import { Component, Input, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  options: AnimationOptions = {
    path: '/assets/animation/walk.json',
  };
  option2: AnimationOptions = {
    path: '/assets/animation/meditation.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
  
  @Input() imagesData!: any[];
  @Input() section: number = 0;
  @Input() signin!: boolean;
  @Input() linkTo!: string;
  @Input() text!: string;
  isImages: boolean = false;
  constructor(private api: AuthenticationService) {}
  ngOnInit(): void {
    // console.log(this.section)
    this.getImages();
    if (this.imagesData) {
      this.isImages = this.imagesData.length ? true : false
    }
  }

  imageData: any
  getImages() {
    this.api.signUpImages().subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.imageData = value.data
        }
      }
    })
  }
}
