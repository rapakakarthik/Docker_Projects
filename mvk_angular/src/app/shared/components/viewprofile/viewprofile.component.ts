import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.scss']
})
export class ViewprofileComponent implements OnInit {
  @Input() sellerDetails!: any

  constructor(private router: Router) {

  }

  @Input() class!: string;

  ngOnInit(): void {}


  goTo(route: any) {
    let company_name = <string>this.sellerDetails.company_name;
    company_name = encodeURIComponent(company_name).toLowerCase();
    // let company_name = <string>this.sellerDetails.company_name.replaceAll(" ", "-").toLowerCase();
    let url = company_name + "-" + ( this.sellerDetails.seller_id || this.sellerDetails.company_id )
    this.router.navigate(['/company', url]);

    // let cin=  this.sellerDetails.pk_seller_account_id +'-'+ this.sellerDetails.company_name    
    // this.router.navigate([`/${route}/${cin}`])
  }


}
