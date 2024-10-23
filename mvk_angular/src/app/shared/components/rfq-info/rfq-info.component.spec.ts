import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqInfoComponent } from './rfq-info.component';

describe('RfqInfoComponent', () => {
  let component: RfqInfoComponent;
  let fixture: ComponentFixture<RfqInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
