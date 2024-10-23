import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqlistDetailsComponent } from './rfqlist-details.component';

describe('RfqlistDetailsComponent', () => {
  let component: RfqlistDetailsComponent;
  let fixture: ComponentFixture<RfqlistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqlistDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqlistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
