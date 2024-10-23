import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { Location } from '@angular/common';
import { RfqHomeComponent } from '../rfq/rfq-home/rfq-home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rfq-card',
  templateUrl: './rfq-card.component.html',
  styleUrls: ['./rfq-card.component.scss'],
})
export class RfqCardComponent implements OnInit {
  dialogRef: any;
 // newUrl: any;
  previousUrl: any;
  constructor(private dialog: MatDialog, private location: Location, private router: Router) {}
  ngOnInit(): void {
    //this.previousUrl = this.location.path();
    //localStorage.setItem('url', this.previousUrl);
    // Change the URL without adding to history
   // this.newUrl = '/rfq';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  userObj: any;
  openRFQForm() {
    if (!localStorage.getItem('token')) {
      this.openDialog();
    } else {
    //  this.location.replaceState(this.newUrl);
      this.dialogRef = this.dialog.open(RfqHomeComponent, {
        width: '1000px',
      });
      this.dialogRef.afterClosed().subscribe((_result: any) => {
       // this.location.replaceState(this.previousUrl);
      });
    }
  }

  goToRfqQuote() {
    this.router.navigateByUrl("/rfq-quote")
  }
}
