import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerReviewsComponent } from './buyer-reviews.component';

describe('BuyerReviewsComponent', () => {
  let component: BuyerReviewsComponent;
  let fixture: ComponentFixture<BuyerReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
