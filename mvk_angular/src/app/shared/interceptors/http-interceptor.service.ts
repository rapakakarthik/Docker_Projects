import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.has('Authorization') && !request.headers.has('Security-Token') && !request.url.includes('ipify')) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'Security-token': environment.key,
        }
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
