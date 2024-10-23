import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRecommendationComponent } from './room-recommendation.component';

describe('RoomRecommendationComponent', () => {
  let component: RoomRecommendationComponent;
  let fixture: ComponentFixture<RoomRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
