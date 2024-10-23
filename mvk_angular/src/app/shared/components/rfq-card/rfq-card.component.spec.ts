import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqCardComponent } from './rfq-card.component';

describe('RfqCardComponent', () => {
  let component: RfqCardComponent;
  let fixture: ComponentFixture<RfqCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
