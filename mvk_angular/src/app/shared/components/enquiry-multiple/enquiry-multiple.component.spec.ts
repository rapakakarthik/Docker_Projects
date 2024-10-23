import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryMultipleComponent } from './enquiry-multiple.component';

describe('EnquiryMultipleComponent', () => {
  let component: EnquiryMultipleComponent;
  let fixture: ComponentFixture<EnquiryMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnquiryMultipleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnquiryMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
