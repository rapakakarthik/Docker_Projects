import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit{

  constructor(
    private titleService: Title, 
    private meta: Meta
    ) {
  }
  
  ngOnInit(): void {
    this.setOpenGraphMetaTags();
  }


  setOpenGraphMetaTags() {
    const description = "Have questions about educational institution procurement? Look no further! Our FAQ covers everything you need to know, from how to create an account to placing an order";
    const url = 'https://www.myverkoper.com/faq';
    const title = "MyVerkoper FAQ - Answers to all your questions"
    const keywords = "Frequently Asked Questions Common Queries Answered, Help and Information,Placing Orders, Shipping Information, Order Tracking, Product Specifications, Quality Assurance, Returns and Exchanges"
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
