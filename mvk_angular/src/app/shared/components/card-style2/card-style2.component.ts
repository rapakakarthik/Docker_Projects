import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';

@Component({
  selector: 'app-card-style2',
  templateUrl: './card-style2.component.html',
  styleUrls: ['./card-style2.component.scss'],
})
export class CardStyle2Component implements OnInit {
  @Input() item!: any;
  @Input()
  linkTo!: string;
  isItem: boolean = false;

  constructor(private _router: Router, public dialog: MatDialog,) {}
  ngOnInit(): void {
    this.isItem = this.item ? true : false;
  }
  userObj: any;
  route(data: any): void {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      let url = '';
      if (data.product_type == 'product') {
        url = '/product/' + data.product_id;
      } else {
        url = '/top' + data.product_manufacture;
      }
      this._router.navigate([url]);
    }else {
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }
}
