import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWishlistComponent } from './company-wishlist.component';

describe('CompanyWishlistComponent', () => {
  let component: CompanyWishlistComponent;
  let fixture: ComponentFixture<CompanyWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyWishlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
