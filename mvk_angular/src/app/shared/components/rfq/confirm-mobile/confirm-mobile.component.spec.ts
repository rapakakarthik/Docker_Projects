import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMobileComponent } from './confirm-mobile.component';

describe('ConfirmMobileComponent', () => {
  let component: ConfirmMobileComponent;
  let fixture: ComponentFixture<ConfirmMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
