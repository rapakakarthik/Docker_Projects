import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsContentComponent } from './terms-content.component';

describe('TermsContentComponent', () => {
  let component: TermsContentComponent;
  let fixture: ComponentFixture<TermsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
