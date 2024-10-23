import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSafeImage]'
})
export class SafeImageDirective {

  @Input() appSafeImage!: string;  // The alternate image URL passed to the directive

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  loadImageError() {
    const element = this.el.nativeElement;
    element.src = this.appSafeImage || 'https://api.myverkoper.com/assets/seller/images/mvk-no-image.png';  // Set a default or use an input variable
  }

}
