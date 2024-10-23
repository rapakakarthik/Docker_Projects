import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturesTabComponent } from './manufactures-tab.component';

describe('ManufacturesTabComponent', () => {
  let component: ManufacturesTabComponent;
  let fixture: ComponentFixture<ManufacturesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturesTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
