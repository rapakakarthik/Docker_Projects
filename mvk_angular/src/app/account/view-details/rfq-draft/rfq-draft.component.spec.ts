import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDraftComponent } from './rfq-draft.component';

describe('RfqDraftComponent', () => {
  let component: RfqDraftComponent;
  let fixture: ComponentFixture<RfqDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqDraftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
