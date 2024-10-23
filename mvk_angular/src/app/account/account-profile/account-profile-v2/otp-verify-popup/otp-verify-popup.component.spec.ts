import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerifyPopupComponent } from './otp-verify-popup.component';

describe('OtpVerifyPopupComponent', () => {
  let component: OtpVerifyPopupComponent;
  let fixture: ComponentFixture<OtpVerifyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtpVerifyPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpVerifyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
