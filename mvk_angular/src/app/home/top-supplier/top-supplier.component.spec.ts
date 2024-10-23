import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSupplierComponent } from './top-supplier.component';

describe('TopSupplierComponent', () => {
  let component: TopSupplierComponent;
  let fixture: ComponentFixture<TopSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
