import { Component, OnInit, inject } from '@angular/core';
import { LayoutModule } from "../../layout/layout.module";
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqNewComponent } from 'src/app/shared/components/rfq/rfq-new/rfq-new.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { WelcomeDialogComponent } from 'src/app/welcome-dialog/welcome-dialog.component';

@Component({
    selector: 'app-rfq-quote',
    standalone: true,
    templateUrl: './rfq-quote.component.html',
    styleUrl: './rfq-quote.component.scss',
    imports: [LayoutModule]
})
export class RfqQuoteComponent implements OnInit{

  rfq = inject(RfqService);
  dialog = inject(MatDialog);
  private router = inject(Router);
  
  constructor(
    private location: Location,
  ) {}
  
  ngOnInit(): void {
    this.checkAuth();
  }

  userId: number = 0;
  userName = "";
  isSignedIn = false;
  checkAuth() {
    if (!localStorage.getItem('token')) {
      // this.openDialog();
      this.getRecommendedProductsRfqWithoutSignin();
    } else {
      if (localStorage.getItem('userObj')) {
        this.isSignedIn = true;
        this.getRecommendedProductsRfq();
        const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
        this.userId = parseInt(userObj.buyerId);
        this.userName = userObj.name;
      }
    }
  }


  browsed_products: any[] = [];
  recommendationProducts: any[] = [];
  browsedProductTitle: string = "";
  rfqCount = 0;
  quotationCount = 0;
  getRecommendedProductsRfq() {
    const obj = {
      skip: 0,
      limit: 10,
    };
    this.rfq.getRecommendedProductsRfq(obj).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.browsed_products = res.data.browsed_products;
          this.browsedProductTitle = res.data.browsed_product_title;
          this.recommendationProducts = res.data.recommendations;
          this.rfqCount = res.data.count.rfq;
          this.quotationCount = res.data.count.quotation;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("rfq products error " + error.message)
      }
    })
  }

  titlewithoutsignin = '';
  getRecommendedProductsRfqWithoutSignin() {
    const obj = {
      skip: 0,
      limit: 10,
    };
    this.rfq.getRecommendedProductsRfqWithoutSignin(obj).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.recommendationProducts = res.recommendation_products;
          this.titlewithoutsignin = res.title;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("rfq products error " + error.message)
      }
    })
  }

  goToRfq(query: string) {
    this.router.navigateByUrl(`/account/viewdetails?rfq=${query}`)
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  
  dialogRef: any;
  productName = "";
  openRFQForm() {
    this.dialogRef = this.dialog.open(RfqNewComponent, {
      width: '1000px',
      data: {
        isSignedIn: this.isSignedIn,
        type: null
      }
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getRecommendedProductsRfq();
    });
  }

  updateRfqName(name: string, image: string, category_id: number) {
    let data = {
      type: "create",
      obj: { name, image, category_id},
      isSignedIn: this.isSignedIn
    }
    this.dialogRef = this.dialog.open(RfqNewComponent, {
      width: '1000px',
      data
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getRecommendedProductsRfq();
    });
  }

  quoteNow() {
    if(this.productName == "") {
      this.openRFQForm();
    } else {
      this.updateRfqName(this.productName.trim(), '', 0);
    }
  }

  goToProduct(id: number, name: string) {
    let productName = encodeURIComponent(name).toLowerCase();
    let url = productName + "-" + id;
    this.router.navigate(['/product', url]);
  }

}
