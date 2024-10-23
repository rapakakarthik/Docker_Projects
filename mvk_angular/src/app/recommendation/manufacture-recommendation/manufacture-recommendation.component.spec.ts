import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureRecommendationComponent } from './manufacture-recommendation.component';

describe('ManufactureRecommendationComponent', () => {
  let component: ManufactureRecommendationComponent;
  let fixture: ComponentFixture<ManufactureRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
