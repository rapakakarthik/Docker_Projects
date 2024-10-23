import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqViewDetailsComponent } from './rfq-view-details.component';

describe('RfqViewDetailsComponent', () => {
  let component: RfqViewDetailsComponent;
  let fixture: ComponentFixture<RfqViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqViewDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
