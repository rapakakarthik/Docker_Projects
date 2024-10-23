// screen-size.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenWidth = new BehaviorSubject<number>(window.innerWidth);

  constructor() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    this.screenWidth.next(window.innerWidth);
  }

  getScreenWidth(): Observable<number> {
    return this.screenWidth.asObservable();
  }
}
