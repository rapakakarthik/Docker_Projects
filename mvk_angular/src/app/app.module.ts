import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { AuthenticationModule } from './authentication/authentication.module';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

import { CustompagesModule } from './custompages/custompages.module';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { AccountModule } from './account/account.module';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { HttpInterceptorService } from './shared/interceptors/http-interceptor.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BannerEffects } from './home/effects/banner.effects';
import { todoReducer } from './shared/reducers/todo.reducer';
import { TodoEffects } from './shared/effects/todo.effects';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { apiSpeedInterceptor } from './api-speed.interceptor';
import { LayoutModule } from './layout/layout.module';
const app = initializeApp(environment.firebase);
const messaging = getMessaging(app);




@NgModule({
  declarations: [AppComponent, DeleteAccountComponent, WelcomeDialogComponent],

  imports: [
    AuthenticationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustompagesModule,
    SocialLoginModule,
    AccountModule,
    ToastrModule.forRoot({
      timeOut: 3000,
     positionClass: 'toast-bottom-center',
     preventDuplicates: true,
      progressBar: true,
      // disableTimeOut: true,
    }),
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    LayoutModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
     
      useClass: apiSpeedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
