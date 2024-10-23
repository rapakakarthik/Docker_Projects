import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNumberComponent } from './view-number.component';

describe('ViewNumberComponent', () => {
  let component: ViewNumberComponent;
  let fixture: ComponentFixture<ViewNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
