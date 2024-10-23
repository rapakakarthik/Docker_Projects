import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRecommendationComponent } from './class-recommendation.component';

describe('ClassRecommendationComponent', () => {
  let component: ClassRecommendationComponent;
  let fixture: ComponentFixture<ClassRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
