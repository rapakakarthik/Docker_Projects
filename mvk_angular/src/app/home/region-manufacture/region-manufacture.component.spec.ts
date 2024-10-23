import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionManufactureComponent } from './region-manufacture.component';

describe('RegionManufactureComponent', () => {
  let component: RegionManufactureComponent;
  let fixture: ComponentFixture<RegionManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionManufactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
