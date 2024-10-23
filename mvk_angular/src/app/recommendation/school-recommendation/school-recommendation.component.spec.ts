import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolRecommendationComponent } from './school-recommendation.component';

describe('SchoolRecommendationComponent', () => {
  let component: SchoolRecommendationComponent;
  let fixture: ComponentFixture<SchoolRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
