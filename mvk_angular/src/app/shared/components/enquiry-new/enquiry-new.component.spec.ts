import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryNewComponent } from './enquiry-new.component';

describe('EnquiryNewComponent', () => {
  let component: EnquiryNewComponent;
  let fixture: ComponentFixture<EnquiryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnquiryNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnquiryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
