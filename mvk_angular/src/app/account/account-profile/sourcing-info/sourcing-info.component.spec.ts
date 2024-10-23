import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingInfoComponent } from './sourcing-info.component';

describe('SourcingInfoComponent', () => {
  let component: SourcingInfoComponent;
  let fixture: ComponentFixture<SourcingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcingInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourcingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
