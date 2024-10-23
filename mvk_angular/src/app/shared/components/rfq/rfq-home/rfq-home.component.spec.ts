import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqHomeComponent } from './rfq-home.component';

describe('RfqHomeComponent', () => {
  let component: RfqHomeComponent;
  let fixture: ComponentFixture<RfqHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
