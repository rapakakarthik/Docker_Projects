import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class apiSpeedInterceptor implements HttpInterceptor {
  obj:any=[];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
           this.obj.push(req.urlWithParams + ' + '+elapsed + 'ms')
          localStorage.setItem('apis', JSON.stringify(this.obj))
        }
      })
    );
  }
}
