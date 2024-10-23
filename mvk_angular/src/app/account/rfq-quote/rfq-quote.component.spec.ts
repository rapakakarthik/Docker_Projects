import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqQuoteComponent } from './rfq-quote.component';

describe('RfqQuoteComponent', () => {
  let component: RfqQuoteComponent;
  let fixture: ComponentFixture<RfqQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqQuoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfqQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
