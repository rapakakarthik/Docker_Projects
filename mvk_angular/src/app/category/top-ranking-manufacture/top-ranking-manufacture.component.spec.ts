import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRankingManufactureComponent } from './top-ranking-manufacture.component';

describe('TopRankingManufactureComponent', () => {
  let component: TopRankingManufactureComponent;
  let fixture: ComponentFixture<TopRankingManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopRankingManufactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRankingManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
