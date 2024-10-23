import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appZoom]'
})
export class ZoomDirective {

  isZoom = false;
  @Input() set appZoom(isZoom: boolean) {
    this.isZoom = isZoom;
    if(!isZoom) {
      this.elementRef.nativeElement.style.left = `0px`;
      this.elementRef.nativeElement.style.top = `0px`;
      this.elementRef.nativeElement.style.position = `static`;
    }
  }
  constructor(private elementRef: ElementRef) { }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isZoom) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      const left = ((rect.width / 2) - event.clientX + rect.left) / 2;
      const top = ((rect.height / 2) - event.clientY + rect.top) / 2;
      this.elementRef.nativeElement.style.left = `${left}px`;
      this.elementRef.nativeElement.style.top = `${top}px`;
      this.elementRef.nativeElement.style.position = `relative`;
    }
  }



}
