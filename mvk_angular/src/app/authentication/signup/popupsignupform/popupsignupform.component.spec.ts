import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsignupformComponent } from './popupsignupform.component';

describe('PopupsignupformComponent', () => {
  let component: PopupsignupformComponent;
  let fixture: ComponentFixture<PopupsignupformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupsignupformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupsignupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
