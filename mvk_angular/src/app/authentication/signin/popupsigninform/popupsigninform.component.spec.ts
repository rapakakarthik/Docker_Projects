import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsigninformComponent } from './popupsigninform.component';

describe('PopupsigninformComponent', () => {
  let component: PopupsigninformComponent;
  let fixture: ComponentFixture<PopupsigninformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupsigninformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupsigninformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
