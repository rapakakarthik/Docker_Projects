import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mfg-list',
  templateUrl: './mfg-list.component.html',
  styleUrls: ['./mfg-list.component.scss']
})
export class MfgListComponent implements OnInit {
  @Input() item!: any;
  @Input() linkTo!: string;
  @Input() showProductImages: boolean = true;
  isItem: boolean = false;
  sellerDetails = {
    sellerAccountId: 0,
    sellerId: 0,
    companyName: "",
    companyLogo: "",
    category_id:"",
    env:'',
    product_id:'',
    buyerSellerStatus: 0
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setSellerDetails()

  }

  setSellerDetails() {
    const cd = this.item.company_details;
    this.sellerDetails.sellerAccountId = cd.pk_seller_account_id;
    this.sellerDetails.sellerId = cd.seller_id | cd.company_id;
    this.sellerDetails.companyName = cd.company_name;
    this.sellerDetails.companyLogo = cd.company_logo;
    this.sellerDetails.category_id = "0";
    this.sellerDetails.env = 'company';
    this.sellerDetails.product_id = ''
    this.sellerDetails.buyerSellerStatus = cd.buyer_seller_status;
  }

  goTo(route: string, id: number) {
    this.router.navigate([`/${route}/${id}`])
  }

}
