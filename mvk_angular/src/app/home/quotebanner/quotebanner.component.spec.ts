import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotebannerComponent } from './quotebanner.component';

describe('QuotebannerComponent', () => {
  let component: QuotebannerComponent;
  let fixture: ComponentFixture<QuotebannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotebannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotebannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
