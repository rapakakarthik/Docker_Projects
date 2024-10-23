import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfgDescComponent } from './mfg-desc.component';

describe('MfgDescComponent', () => {
  let component: MfgDescComponent;
  let fixture: ComponentFixture<MfgDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfgDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfgDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
