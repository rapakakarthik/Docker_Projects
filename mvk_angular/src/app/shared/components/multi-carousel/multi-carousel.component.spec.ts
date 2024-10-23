import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCarouselComponent } from './multi-carousel.component';

describe('MultiCarouselComponent', () => {
  let component: MultiCarouselComponent;
  let fixture: ComponentFixture<MultiCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
