import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqSubmissionComponent } from './rfq-submission.component';

describe('RfqSubmissionComponent', () => {
  let component: RfqSubmissionComponent;
  let fixture: ComponentFixture<RfqSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfqSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
