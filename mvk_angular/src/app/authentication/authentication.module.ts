import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { TextBoxComponent } from './text-box/text-box.component';
import { SingleSelectComponent } from './single-select/single-select.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { MobileComponent } from './mobile/mobile.component';
import { SigninformComponent } from './signin/signinform/signinform.component';
import { PopupsigninformComponent } from './signin/popupsigninform/popupsigninform.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { EmailComponent } from './email/email.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { SignupV2Component } from './signup-v2/signup-v2.component';
import { PopupsignupformComponent } from './signup/popupsignupform/popupsignupform.component';
import { PopupsignupComponent } from './signup/popupsignup/popupsignup.component';
import { RfqsignupComponent } from './signup/rfqsignup/rfqsignup.component';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    TextBoxComponent,
    SingleSelectComponent,
    MultiSelectComponent,
    MobileComponent,
    SigninformComponent,
    PopupsigninformComponent,
    EmailComponent,
    DeleteAccountComponent,
    SignupV2Component,
    PopupsignupformComponent,
    PopupsignupComponent,
    RfqsignupComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireMessagingModule 
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1522385301591861')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
})
export class AuthenticationModule { }
// "firebase": "^8.10.1",
