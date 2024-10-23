import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryV2Component } from './enquiry-v2.component';

describe('EnquiryV2Component', () => {
  let component: EnquiryV2Component;
  let fixture: ComponentFixture<EnquiryV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiryV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
