import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContactComponent } from './company-contact.component';

describe('CompanyContactComponent', () => {
  let component: CompanyContactComponent;
  let fixture: ComponentFixture<CompanyContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
