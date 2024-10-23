import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {} // AuthService is your authentication service

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('/refresh-token')) {
          // If the request returns a 401 Unauthorized error and it's not the token refresh request itself
          // Attempt to refresh the token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // If token refresh is successful, clone the original request with the new token
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.getAccessToken()}`
                }
              });
              return next.handle(newRequest);
            }),
            catchError(() => {
              // If token refresh fails, redirect to login or do other appropriate actions
             // this.authService.logout();
              return throwError('Token refresh failed');
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
