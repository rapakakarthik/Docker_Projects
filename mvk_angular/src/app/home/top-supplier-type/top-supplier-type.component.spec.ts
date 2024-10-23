import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSupplierTypeComponent } from './top-supplier-type.component';

describe('TopSupplierTypeComponent', () => {
  let component: TopSupplierTypeComponent;
  let fixture: ComponentFixture<TopSupplierTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopSupplierTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSupplierTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
