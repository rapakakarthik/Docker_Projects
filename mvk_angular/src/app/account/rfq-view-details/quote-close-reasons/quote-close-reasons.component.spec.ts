import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCloseReasonsComponent } from './quote-close-reasons.component';

describe('QuoteCloseReasonsComponent', () => {
  let component: QuoteCloseReasonsComponent;
  let fixture: ComponentFixture<QuoteCloseReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteCloseReasonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteCloseReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
