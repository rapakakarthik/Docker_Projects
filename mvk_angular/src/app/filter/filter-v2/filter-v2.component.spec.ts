import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterV2Component } from './filter-v2.component';

describe('FilterV2Component', () => {
  let component: FilterV2Component;
  let fixture: ComponentFixture<FilterV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
