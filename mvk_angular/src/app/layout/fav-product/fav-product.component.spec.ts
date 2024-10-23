import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavProductComponent } from './fav-product.component';

describe('FavProductComponent', () => {
  let component: FavProductComponent;
  let fixture: ComponentFixture<FavProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
