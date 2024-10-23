import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyContentComponent } from './privacy-content.component';

describe('PrivacyContentComponent', () => {
  let component: PrivacyContentComponent;
  let fixture: ComponentFixture<PrivacyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
