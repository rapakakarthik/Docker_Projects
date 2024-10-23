import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popupsigninform',
  templateUrl: './popupsigninform.component.html',
  styleUrls: ['./popupsigninform.component.scss']
})
export class PopupsigninformComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<PopupsigninformComponent>,
    @Inject(MAT_DIALOG_DATA) public url: any,
    private router: Router
  ) { }
  ngOnInit(): void {
    if(typeof this.url === 'object') {
      this.closepopup(this.url)
    }
    // console.log(this.url);
  }

  fromPopup: boolean = true;

  showSignIn = true;
  object: any;
  closepopup(obj: {isSignIn: boolean, obj: any, close?: boolean}) {
    if(obj.isSignIn) {
      this.dialogRef.close();
      if(obj.close) {
        return;
      }
      if(typeof this.url === 'string') {
        this.router.navigate([this.url]).then(() => {
          window.location.reload();
        });
      }
    } else {
      this.object = {...obj.obj};
      this.showSignIn = false;
      this.dialogRef.updateSize('850px');
      this.dialogRef.disableClose = true;
    }
  }

  close():void {
    this.dialogRef.close();
    if(typeof this.url === 'string') {
      this.router.navigateByUrl(this.url);
    } else {
      this.router.navigateByUrl("/");
    }
  }
}
