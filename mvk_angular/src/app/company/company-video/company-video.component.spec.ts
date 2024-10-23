import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVideoComponent } from './company-video.component';

describe('CompanyVideoComponent', () => {
  let component: CompanyVideoComponent;
  let fixture: ComponentFixture<CompanyVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
