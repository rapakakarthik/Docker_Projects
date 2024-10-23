import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProfileV2Component } from './account-profile-v2.component';

describe('AccountProfileV2Component', () => {
  let component: AccountProfileV2Component;
  let fixture: ComponentFixture<AccountProfileV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountProfileV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountProfileV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
