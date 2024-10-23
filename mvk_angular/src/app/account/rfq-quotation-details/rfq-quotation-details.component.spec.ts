import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqQuotationDetailsComponent } from './rfq-quotation-details.component';

describe('RfqQuotationDetailsComponent', () => {
  let component: RfqQuotationDetailsComponent;
  let fixture: ComponentFixture<RfqQuotationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqQuotationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqQuotationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
