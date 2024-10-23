import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-top-product',
  templateUrl: './top-product.component.html',
  styleUrls: ['./top-product.component.scss']
})
export class TopProductComponent implements OnInit {

  products: Products[] = [];
  topProductLoad: boolean = false;
  
  constructor(private crud : CrudService) {}
  ngOnInit(): void {
    this.getTopProducts()
  }

  getTopProducts() {
    this.topProductLoad = true
    let skip = 0;
    this.crud.getTopRanking('product', 2, skip).subscribe(res => {
    this.topProductLoad = false;
      this.products = res.data.products
    })
  }
}

export interface Products {
  category_id : number,
  category_name : string,
  product_description: string,
  product_id: number,
  Product_image: string,
  Product_name: string,
  Product_price: string,
  Product_quantity: number,
  Product_rating: number,
  Product_reviews: number,
  seller_id: number
}
