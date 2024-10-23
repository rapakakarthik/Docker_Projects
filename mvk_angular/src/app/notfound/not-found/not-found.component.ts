import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, UrlTree } from '@angular/router';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { Location } from '@angular/common';
import { timer, map, takeWhile, shareReplay, tap } from 'rxjs';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit{
  dialogRef: any;
  newUrl: any;
  previousUrl: any;
  prurl?: any;
  constructor(
    private route: Router,
    private dialog: MatDialog,
    private location: Location
  ) {
    if (localStorage.getItem('url') != null && this.location.path() == '/rfq') {
      this.prurl = localStorage.getItem('url');
      this.route.navigateByUrl(this.prurl);
    }

    if (this.location.path() == '/rfq') {
      this.openRFQForm();
    }
  }
  ngOnInit(): void {
    this.redirectHome$.subscribe();
  }
  goback() {
    this.route.navigateByUrl('/');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //  console.log('The dialog was closed');
    });
  }

  openRFQForm() {
    if (!localStorage.getItem('token')) {
      this.openDialog();
    } else {
      this.dialogRef = this.dialog.open(RfqComponent, {
        width: '1000px',
      });

      this.dialogRef.afterClosed().subscribe((_result: any) => {
        //  console.log('The dialog was closed');
      });
    }
  }

  countDown$ = timer(0, 1000).pipe(
    map((value) => 10 - value),
    takeWhile((value) => value >= 0),
    shareReplay(1)
  );

  redirectHome$ = this.countDown$.pipe(
    tap((value) => {
      if (value <= 0) {
        this.route.navigateByUrl('/');
      }
    })
  );
}
