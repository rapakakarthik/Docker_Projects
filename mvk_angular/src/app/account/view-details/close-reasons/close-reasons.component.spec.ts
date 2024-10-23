import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseReasonsComponent } from './close-reasons.component';

describe('CloseReasonsComponent', () => {
  let component: CloseReasonsComponent;
  let fixture: ComponentFixture<CloseReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
