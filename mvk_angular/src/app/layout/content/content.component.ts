import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqHomeComponent } from 'src/app/shared/components/rfq/rfq-home/rfq-home.component';
// import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit{
  signloader: boolean = false
  rfqloader: boolean = false;

  dialogRef: any;
  newUrl:any;
  previousUrl:any
  // @Input() homeBannersData: any[] = [];
constructor(private router: Router,private dialog: MatDialog, private location: Location)
{

}

  goto()
  {
    this.router.navigate(['/category/all'])
  }

  islogin = false;
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.islogin = true;
    }
    else {
      this.islogin = false
    }
    // throw new Error('Method not implemented.');
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  openRFQForm() {
    if (!localStorage.getItem("token")) {
      this.openDialog()
    }else {
    //  this.location.replaceState(this.newUrl);
      this.dialogRef = this.dialog.open(RfqHomeComponent, {
        width: '1000px'
      });
      this.dialogRef.afterClosed().subscribe((_result: any) => {
     //   this.location.replaceState(this.previousUrl);
      });
    }
  }



}

// not using
