import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCompareComponent } from './supplier-compare.component';

describe('SupplierCompareComponent', () => {
  let component: SupplierCompareComponent;
  let fixture: ComponentFixture<SupplierCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
