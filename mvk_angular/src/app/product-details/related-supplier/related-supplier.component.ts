import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CrudService } from "src/app/shared/services/crud.service";
import { Supplier } from "../models/product";

@Component({
  selector: 'app-related-supplier',
  templateUrl: './related-supplier.component.html',
  styleUrl: './related-supplier.component.scss'
})
export class RelatedSupplierComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private crud = inject(CrudService);
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let url: string = params["id"];
      let productId = Number(url.slice(url.lastIndexOf("-") + 1));
      this.getProductDetils(productId);
    });
  }

  constructor() {}

  suppliersFound: boolean = false;
  loader: boolean = true;
  otherSuppliers: Supplier[] = [];

  getProductDetils(id: number) {

    this.crud.getProductDetilsV2(id).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status == 200) {
          this.otherSuppliers = res.data.other_suppliers;
          this.suppliersFound = true;
        } else {
          this.suppliersFound = false;
          this.otherSuppliers = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        this.suppliersFound = false;
        console.log(err.message);
      },
    });
  } 


  goToCompany(name: string, id: number) {
    let cname = encodeURIComponent(name).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate([`/company/${url}`]);
  }


  goToProduct(name: string, id: number) {
    let cname = encodeURIComponent(name).toLowerCase();
    let url = cname + "-" + id;
    this.router.navigate([`/product/${url}`]);
  }

  category_name = '';
  category_id = 0;
  navToCat(id: number, name: string) {
    let url = '/category/' + encodeURIComponent(name).toLowerCase() + '-' + id;
    this.router.navigate([url]);
  }

  getSellerDetails(supplier: Supplier) {
    return {
      productName: supplier.product_name,
      sellerAccountId: supplier.company_id,
      sellerId: supplier.seller_id,
      companyName: supplier.company_name,
      companyLogo: supplier.image,
      category_id: 0,
      env: 'product',
      product_id: supplier.product_id,
      buyerSellerStatus: supplier.buyer_seller_status
    }
  }
}