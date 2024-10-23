import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { WelcomeDialogComponent } from 'src/app/welcome-dialog/welcome-dialog.component';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  constructor(
    private authS: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.authS.getToken()) {
      this.router.navigate(['/products'])
    }
  }

  openWelcomeDialog(): void {
    this.dialog.open(WelcomeDialogComponent, {
      width: '500px'
    });
  }
}