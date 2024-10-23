import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedSupplierComponent } from './related-supplier.component';

describe('RelatedSupplierComponent', () => {
  let component: RelatedSupplierComponent;
  let fixture: ComponentFixture<RelatedSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatedSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
