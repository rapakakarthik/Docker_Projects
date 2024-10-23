import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog.service';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { Validators, ValidatorFn, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit{

  dynamicHtmlContent!: SafeHtml;
  
  constructor(private api: BlogService, 
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer,  
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title
    ) {
    this.createcommentForm();
  }
  ngOnInit(): void {
    this.pageUrl = window.location.href;
    this.getRouteParams();
  }

  ngOnDestroy(): void {
    this.title.setTitle("MyVerkoper: B2B Ecommerce Marketplace for Education Institutions");
  }

  getRouteParams() {
    this.route.paramMap.subscribe(res => {
      let name = res.get('id') ?? '';
      this.getBlogsDetails(name);
    })
  }

  blogDetails: any;
  recommendBlogs: any[] = [];
  tableOfContent: any[] = [];
  blogNotFound = false;
  getBlogsDetails(name: string) {
    this.blogNotFound = false;
    this.api.getBlogsDetails(name).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.blogDetails = value.blog;
          this.setOpenGraphMetaTags(value.blog);
          this.generateProductSchema();
          this.recommendBlogs = value.blog.recomended_blog;
          this.tableOfContent = value.blog.table_of_content;
          // console.log(this.recommendBlogs);
          this.dynamicHtmlContent= this.sanitizer.bypassSecurityTrustHtml(this.blogDetails.description);

        } else {
          this.blogNotFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('blog details error', err.message);
        this.blogNotFound = true;
      }
    })
  }

  commentForm!: FormGroup;
  createcommentForm() {
    this.commentForm = this.fb.group({
      // phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['',  [Validators.required, emailValidator()]],
      username: ['',  Validators.required],
      comment: ['',  Validators.required]
    })
  }

 

  get Email() {
    return this.commentForm.get('email')
  }
  // get Phone() {
  //   return this.commentForm.get('phone')
  // }

  submitBtn: boolean = true
  contactUs(value: Comment): void {
    this.submitBtn = false;
    const comment: Comment = {
      ...value,
      blog_id: this.blogDetails.pk_blog_id
    }
    // console.log(comment);
    this.api.postComment(comment).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.submitBtn = true;
          this.toastr.success("Thanks for your Feedback");
          this.commentForm.reset();
          this.commentForm.markAsUntouched();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.submitBtn = true;
        this.toastr.error(error.message);
      }
    })
  }

  setOpenGraphMetaTags(blogData: any) {
    let blog_name = <string>blogData.blog_title;
    blog_name = encodeURIComponent(blog_name).toLowerCase();
    const description = this.stripHtmlTags(blogData.description).trim().slice(0, 160);
    let url = 'https://www.myverkoper.com/blog/' + blogData.url_slug;
    this.title.setTitle(blogData.blog_title + " - MyVerkoper.com");
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: blogData.blog_title});
    this.meta.updateTag({ property: 'og:description',  content: description });
    this.meta.updateTag({ name: 'description',  content: description });
    this.meta.updateTag({ name: 'keywords',  content: description });
    this.meta.updateTag({ property: 'og:image', itemprop: "image", content: blogData.blog_image });

    this.meta.updateTag({ name: 'twitter:title', content: blogData.blog_title});
    this.meta.updateTag({ name: 'twitter:image', content: blogData.blog_image });
    this.meta.updateTag({ name: 'twitter:description',  content: description });
  }

  // Generating schema function
  productSchema: any;
  generateProductSchema(): void {

    const description = this.stripHtmlTags(this.blogDetails.description).trim().slice(0, 160);
    this.productSchema = {
      "@context": "https://schema.org/",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.myverkoper.com/blog/" + this.blogDetails.url_slug,
      },
      "headline":  this.blogDetails.blog_title,
      "description":  description,
      "image": {
        "@type": "ImageObject",
        "url": this.blogDetails.blog_image,
        "width": "1200",
        "height": "630"
      },
      "author": {
        "@type": "Organization",
        "name": "MyVerkoper"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MyVerkoper",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.myverkoper.com/assets/images/logo.gif",
          "width": "536",
          "height": "60"
        }
      },
      "datePublished": this.blogDetails.created_at
    }
    
    this.appendJsonLdScript();
  }
    

  private appendJsonLdScript(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(this.productSchema);

    // Append the script to the document head
    document.head.appendChild(script);
  }

  private stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  applyClass = false;
  openSidebar(){
    this.applyClass = true;
  }

  closeSidebar(){
    this.applyClass = false;
  }

  scrollToHead(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  pageUrl: string = "";
  shareToFb() {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.pageUrl)}`;
    window.open(fbShareUrl, '_blank');
  }

  shareOnTwitter(): void {
    const text = 'Check out this page!';
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.pageUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, '_blank');
  }

  shareOnLinkedIn(): void {
    const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(this.pageUrl)}`;
    window.open(linkedInShareUrl, '_blank');
  }

  shareOnWhatsApp(): void {
    const whatsAppShareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(this.pageUrl)}`;
    window.open(whatsAppShareUrl, '_blank');
  }

}

interface Comment {
  blog_id?: number;
  email: string;
  username: string;
  comment: string;
}

function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}