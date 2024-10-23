import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPageProfileComponent } from './company-page-profile.component';

describe('CompanyPageProfileComponent', () => {
  let component: CompanyPageProfileComponent;
  let fixture: ComponentFixture<CompanyPageProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyPageProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
