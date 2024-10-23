import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit{

  constructor(
    private titleService: Title, 
    private meta: Meta
    ) {
  }
  
  ngOnInit(): void {
    this.setOpenGraphMetaTags();
  }


  setOpenGraphMetaTags() {
    const description = "Learn about MyVerkoper, the leading B2B e-commerce marketplace for educational institutions. Explore our commitment to efficiency, quality, and customer satisfaction.";
    const url = 'https://www.myverkoper.com/about';
    const title = "About MyVerkoper - Your Trusted Partner in Educational Procurement"
    const keywords = "Educational Supplies Marketplace, B2B Educational Products, Trusted Educational Suppliers, Innovative Learning Solutions, Quality School Supplies, Educational Resources Platform, Reliable B2B Partnership"
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: "og:url", property: 'og:url', content: url });
    this.meta.updateTag({ name: 'og:title', property: 'og:title', content: title});
    this.meta.updateTag({ name: 'og:description', property: 'og:description',  content: description });
    this.meta.updateTag({ name: 'description',  content: description });
    this.meta.updateTag({ name: 'keywords',  content: keywords});
    this.meta.updateTag({ name: 'twitter:title', content: title});
    this.meta.updateTag({ name: 'twitter:description',  content: description });
  }

}
