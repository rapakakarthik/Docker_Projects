import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistShareInviteComponent } from './wishlist-share-invite.component';

describe('WishlistShareInviteComponent', () => {
  let component: WishlistShareInviteComponent;
  let fixture: ComponentFixture<WishlistShareInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistShareInviteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishlistShareInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
