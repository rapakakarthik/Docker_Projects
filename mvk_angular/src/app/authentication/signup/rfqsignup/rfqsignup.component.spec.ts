import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqsignupComponent } from './rfqsignup.component';

describe('RfqsignupComponent', () => {
  let component: RfqsignupComponent;
  let fixture: ComponentFixture<RfqsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RfqsignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfqsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
