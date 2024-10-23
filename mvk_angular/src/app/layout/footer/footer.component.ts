import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit{

  private crud = inject(CrudService);
  private router = inject(Router);
  
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}
  ngOnInit(): void {
    this.getFooterCategories();
    this.getFooterContent();
    this.getFooterTopSearch();
  }

  addLinkedinCode() {
    const script1 = this.renderer.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `
      _linkedin_partner_id = "5447284";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_idssss || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `;
    this.renderer.appendChild(this.document.body, script1);

    const script2 = this.renderer.createElement('script');
    script2.type = 'text/javascript';
    script2.async = true;
    script2.src = `
      (function(l) {
      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
      window.lintrk.q=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);})(window.lintrk);
    `;
    this.renderer.appendChild(this.document.body, script2);
  }

  termspopup() {
    this.router.navigateByUrl('/terms');
  }
  privacypopup() {
    this.router.navigateByUrl('/privacy');
  }
  year = new Date().getFullYear();


  // categories = [
  //  {
  //   main_name: "Books",
  //   sub: [{name: 'workbooks', id: 2}, {name: 'textbooks', id: 3}]
  //  },
  //  {
  //   main_name: "uniforms",
  //   sub: [{name: 'shirts', id: 3}, {name: 'pants', id: 4}]
  //  },
  // ]

  categories: any[] = []
  getFooterCategories() {
    this.crud.getFooterCategories().subscribe({
      next: (value) =>{
        if(value.status === 200) {
          this.categories = value.data;
        }
      },
      error: (err) => {
        
      },
    })
  }

  footerContent: any
  getFooterContent() {
    this.crud.getFooterContent().subscribe({
      next: (value) =>{
        if(value.status === 200) {
          this.footerContent = value.data;
        }
      },
      error: (err) => {
        
      },
    })
  }

  topCategories: any[] = []
  getFooterTopSearch() {
    this.crud.getFooterTopSearch().subscribe({
      next: (value) =>{
        if(value.status === 200) {
          this.topCategories = value.data;
        }
      },
      error: (err) => {
        
      },
    })
  }

}
