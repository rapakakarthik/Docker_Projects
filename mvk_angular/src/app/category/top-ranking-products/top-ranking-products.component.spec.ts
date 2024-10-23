import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRankingProductsComponent } from './top-ranking-products.component';

describe('TopRankingProductsComponent', () => {
  let component: TopRankingProductsComponent;
  let fixture: ComponentFixture<TopRankingProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopRankingProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRankingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
