import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {
  @Input() item: any;
  @Input() seller! : {id : number, name: string, image : string}
  @Input() linkTo!: string;
  @Input() recomendationItems!: any;
  constructor(private _router: Router) {}
  ngOnInit(): void {}

  route(cId : number, pId: number): void {
    this._router.navigate([this.linkTo, cId, pId]);
  }
  // .pk_prod_id

  route2(data: any) {
    console.log(data);
    let product_name = <string>(data.prod_name ?? data.product_name);
    product_name = encodeURIComponent(product_name);
    let product_id = data.product_id || data.pk_prod_id
    let url = product_name + "-" + product_id
    this._router.navigate(['/product', url])
  }
}