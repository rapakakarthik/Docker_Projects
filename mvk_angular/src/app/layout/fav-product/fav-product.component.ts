import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fav-product',
  templateUrl: './fav-product.component.html',
  styleUrls: ['./fav-product.component.scss']
})
export class FavProductComponent implements OnInit{
  products: any[] = [];
  noFavoritesFound = false;
  justForYouLoad = false;

  constructor(private crud: CrudService, private toastr: ToastrService, private router: Router) {}
  ngOnInit(): void {
    this.getFavProducts(20, 0);
  }

  getFavProducts(limit: number, skip: number) {
    this.noFavoritesFound = false;
    this.justForYouLoad = true;
    this.crud.getFavProducts(limit, skip).subscribe({
      next: (respose) => {
        this.justForYouLoad = false;
        if(respose.status === 200) {
          this.products = respose.data;
          if(this.products.length == 0) {
            this.noFavoritesFound = true;
          }
        }
        else if(respose.status == 400 && respose.message == 'Unauthorized') {
          this.toastr.info('Session Expires Login Again')
          localStorage.removeItem('token');
          localStorage.removeItem('userObj');
          this.router.navigate(['/signin']);
        }
        else {
          this.products = [];
          this.noFavoritesFound = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.noFavoritesFound = true;
        this.justForYouLoad = false;
        console.log(error.message, error.error);
      }
    })
  }

}
