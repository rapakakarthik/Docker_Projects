import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsignupComponent } from './popupsignup.component';

describe('PopupsignupComponent', () => {
  let component: PopupsignupComponent;
  let fixture: ComponentFixture<PopupsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupsignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
