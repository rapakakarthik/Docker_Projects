import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistShareEditComponent } from './wishlist-share-edit.component';

describe('WishlistShareEditComponent', () => {
  let component: WishlistShareEditComponent;
  let fixture: ComponentFixture<WishlistShareEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistShareEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishlistShareEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
