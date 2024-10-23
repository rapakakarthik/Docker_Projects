import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorynewComponent } from './categorynew.component';

describe('CategorynewComponent', () => {
  let component: CategorynewComponent;
  let fixture: ComponentFixture<CategorynewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorynewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorynewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
