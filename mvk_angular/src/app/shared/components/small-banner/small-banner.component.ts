import { Component } from '@angular/core';

@Component({
  selector: 'app-small-banner',
  templateUrl: './small-banner.component.html',
  styleUrls: ['./small-banner.component.scss']
})
export class SmallBannerComponent {

  bannerObj = {
    bannerId: 1,
    primaryColor: 'rgb(134, 254, 67)',
    bgColor: 'rgb(134, 254, 67)',
    gradientColor: 'rgb(134, 254, 67)',
    tagBg: 'rgb(134, 254, 67, 0.3)',
    tagText: "Special event",
    titleText: 'Games that go beyond stereotypes',
    description: "Finding Pride",
    image: 'https://play-lh.googleusercontent.com/hceSge3ffP8-Gj7PXVL32FZ5toGJ5mP9sK8zemRP-TUz8sXIrGjFkpkWN3TEd1s5AOPQZajGVnOX=w648-h364-rw',
  }
}
