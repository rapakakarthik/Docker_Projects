import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-contact',
  templateUrl: './company-contact.component.html',
  styleUrls: ['./company-contact.component.scss']
})
export class CompanyContactComponent implements OnInit, OnChanges {
  companyProfile!: any;
  @Input() companyProfileDetails: any;
  @Input() sellerDetails: any;

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(): void {
    if(this.companyProfileDetails) this.getCompanyDetails()
  }

  contactDetails: any[] = [];
  getCompanyDetails() {
    this.contactDetails = this.companyProfileDetails.contact;
    this.companyProfile = this.companyProfileDetails.company_profile;
  }
  
}
