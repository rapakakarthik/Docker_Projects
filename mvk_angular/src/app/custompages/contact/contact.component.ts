import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Contact, CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit{
  contactForm!: FormGroup;
  salutation: {key: string, value: number}[] = [{key: "Mr", value: 1}, {key: "Mrs", value: 2}, {key: "Ms", value: 3}]
  constructor(
    private crud: CrudService, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    private titleService: Title, 
    private meta: Meta
    ) {
    this.createContactForm();
  }
  ngOnInit(): void {
    this.setOpenGraphMetaTags();
  }

  createContactForm() {
    this.contactForm = this.fb.group({
      // salutation: [null],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['',  [Validators.required, emailValidator()]],
      fullname: ['',  Validators.required],
      subject: ['',  Validators.required],
      message: ['',  Validators.required]
    })
  }

 

  get Email() {
    return this.contactForm.get('email')
  }
  get Phone() {
    return this.contactForm.get('phone')
  }

  submitBtn: boolean = true
  contactUs(contactForm: Contact): void {
    this.submitBtn = false;
    // console.log(contactForm)
    this.crud.contactUs(contactForm).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.submitBtn = true;
          this.toastr.success("Contact Form Submitted Successfully, Wait for reply from Us");
          this.contactForm.reset();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.submitBtn = true;
        this.toastr.error(error.message);
      }
    })
  }

  setOpenGraphMetaTags() {
    const description = "Reach out to us at MyVerkoper for seamless B2B procurement in the education sector. Your needs matter, and we're here to assist. Contact us today!"
    const url = 'https://www.myverkoper.com/contact';
    const title = "Contact MyVerkoper - B2B E-Commerce for Educational Procurement";
    this.titleService.setTitle(title);
    const keywords = "B2B Educational Product Catalog, Diverse Educational Supplies, Quality Classroom Materials, Bulk Educational Orders, Customized Learning Solutions, School Furniture and Equipment,Teaching Aids and Resources,STEM Education Supplies,Art and Craft Materials,Competitive B2B Pricing";
    this.meta.updateTag({ name: "og:url", property: 'og:url', content: url });
    this.meta.updateTag({ name: 'og:title', property: 'og:title', content: title});
    this.meta.updateTag({ name: 'og:description', property: 'og:description',  content: description });
    this.meta.updateTag({ name: 'description',  content: description });
    this.meta.updateTag({ name: 'keywords',  content: keywords});
    this.meta.updateTag({ name: 'twitter:title', content: title});
    this.meta.updateTag({ name: 'twitter:description',  content: description });
  }

}


function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}