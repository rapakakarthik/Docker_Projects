import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LayoutModule } from "../../layout/layout.module";
import { Router, RouterLink } from '@angular/router';
import { RfqsignupComponent } from 'src/app/authentication/signup/rfqsignup/rfqsignup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-rfq-submission',
    standalone: true,
    templateUrl: './rfq-submission.component.html',
    styleUrl: './rfq-submission.component.scss',
    imports: [LayoutModule, RouterLink]
})
export class RfqSubmissionComponent implements OnInit, OnDestroy{

    router = inject(Router);
    private dialog = inject(MatDialog);
    
    constructor() {}
    ngOnDestroy(): void {
        localStorage.removeItem('accountExists');
        localStorage.removeItem('r-mobile');
        localStorage.removeItem('r-token');
    }
    ngOnInit(): void {
        this.checkNumberExists();
    }

    mobileNumber = 0;
    token = "skljksl";
    isSignedIn = false;
    accountExists = false;
    checkNumberExists() {
        let mobile = localStorage.getItem('r-mobile');
        let rToken = localStorage.getItem('r-token');
        let token = localStorage.getItem('token');
        let exists = localStorage.getItem('accountExists');
        if(token) {
            this.isSignedIn = true;
        }
        else if(exists == "true") {
            this.accountExists = true;
        }
        else {
            if(!!mobile && !!rToken) {
                this.mobileNumber = parseInt(mobile);
                this.token = rToken;
            } else {
                this.router.navigateByUrl("/");
            }
        }
    }

    goToRfqList() {
        this.router.navigateByUrl("/account/viewdetails?rfq=all")
    }

    goToRfq() {
        this.router.navigateByUrl("/rfq-quote")
    }

    // if not signed up
    userData: any;
    continueSignup() {
      let user = {
        mobile: this.mobileNumber,
        token: this.token
      };
      this.openSignupPopup(user);
    }

      
    openSignupPopup(obj: {mobile: number, token: string}) {
        if(obj) {
            this.openDialog(obj);
        } else {
            this.router.navigate(['/products']);
        }
    }

    openDialog(data: {mobile: number, token: string}): void {
        this.dialog.open(RfqsignupComponent, {
          width: '850px',
          data,
          disableClose: true
        });
    }

}
