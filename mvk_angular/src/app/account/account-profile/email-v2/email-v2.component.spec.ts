import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailV2Component } from './email-v2.component';

describe('EmailV2Component', () => {
  let component: EmailV2Component;
  let fixture: ComponentFixture<EmailV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
