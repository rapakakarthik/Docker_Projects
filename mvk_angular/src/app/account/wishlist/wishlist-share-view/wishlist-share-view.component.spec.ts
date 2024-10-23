import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistShareViewComponent } from './wishlist-share-view.component';

describe('WishlistShareViewComponent', () => {
  let component: WishlistShareViewComponent;
  let fixture: ComponentFixture<WishlistShareViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistShareViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishlistShareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
