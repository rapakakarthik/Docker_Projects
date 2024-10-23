import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProfileV3Component } from './account-profile-v3.component';

describe('AccountProfileV3Component', () => {
  let component: AccountProfileV3Component;
  let fixture: ComponentFixture<AccountProfileV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountProfileV3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountProfileV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
