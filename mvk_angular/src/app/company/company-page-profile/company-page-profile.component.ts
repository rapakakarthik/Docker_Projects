import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-page-profile',
  templateUrl: './company-page-profile.component.html',
  styleUrls: ['./company-page-profile.component.scss']
})
export class CompanyPageProfileComponent implements OnInit {

  @Input() set companyProfileDetails(data: any) {
    this.getCompanyDetails(data);
  }

  constructor() { }
  ngOnInit(): void {}

  companyProfile: any;
  basicDetails: any;
  profileDetails: any[] = [];
  getCompanyDetails(data: any) {
    this.companyProfile = data.company_profile;
    this.basicDetails = data.basic_details;
    this.profileDetails = data.company_profile_details;
  }

  getFileType(url: string): string {
    if(url.toLowerCase().endsWith(".pdf")) {
      return "pdf"
    } 
    return "image";
  }
}
